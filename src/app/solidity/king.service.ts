import {Injectable} from '@angular/core';
import {BuildingType} from "../enums/building-type";
import {Contract} from "web3-eth-contract";
import {Store} from "@ngxs/store";
import {Web3Service} from "../services/web3.service";
import KingStaking from "../../../build/contracts/KingStaking.json";
import KingToken from "../../../build/contracts/KingToken.json";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {WalletState, WalletStateModel} from "../state/wallet/wallet.state";
import {Observable} from "rxjs";
import {Networks} from "../interfaces/networks";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
@UntilDestroy()
export class KingService {
  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  kingContract!: Promise<Contract>;
  kingStakingContract!: Contract;

  currentAccount: string = '';

  constructor(
    public store: Store,
    public web3: Web3Service,
  ) {
    this.kingStakingContract = new this.web3.eth.Contract(KingStaking.abi as any, (KingStaking.networks as Networks)[environment.networkId]?.address);
    this.kingContract = this.kingStakingContract.methods.currency().call().then((address: string) => {
      return new this.web3.eth.Contract(KingToken.abi as any, address);
    });
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.currentAccount = state.publicAddress;
    });
  }

  async getOwnedAmount(): Promise<number> {
    const amount = await (await this.kingContract).methods.balanceOf(this.currentAccount).call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async stake(buildingType: BuildingType): Promise<void> {
    const requiredAmount = this.web3.utils.toBN(await this.kingStakingContract.methods.getRequiredStakeAmount().call({from: this.currentAccount}));
    const approvedAmount = this.web3.utils.toBN(await (await this.kingContract).methods.allowance(this.currentAccount, this.kingStakingContract.options.address).call({from: this.currentAccount}));
    if (approvedAmount.lt(requiredAmount)) {
      await (await this.kingContract).methods.approve(this.kingStakingContract.options.address, requiredAmount).send({from: this.currentAccount});
    }
    await this.kingStakingContract.methods.stake(requiredAmount, buildingType).send({from: this.currentAccount});
  }

  async getStakeCompleteTimestamp(): Promise<number> {
    return +await this.kingStakingContract.methods.getStakeCompleteTimestamp().call({from: this.currentAccount});
  }

  // TODO: Suppress call when path ended
  async getRequiredStakeAmount(): Promise<number> {
    const amount = await this.kingStakingContract.methods.getRequiredStakeAmount().call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async getTotalStaked(): Promise<number> {
    const amount = await this.kingStakingContract.methods.stakedCurrencies(this.currentAccount).call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async canCompleteStake(): Promise<boolean> {
    return this.kingStakingContract.methods.canCompleteStake().call({from: this.currentAccount});
  }

  async claimStakeReward(): Promise<void> {
    await this.kingStakingContract.methods.completeStake().send({from: this.currentAccount});
  }

  async getUnlockedTiers(): Promise<number> {
    return +await this.kingStakingContract.methods.getUnlockedTiers().call({from: this.currentAccount});
  }

  async unstake(): Promise<void> {
    await this.kingStakingContract.methods.unstake().send({from: this.currentAccount});
  }

  async getCurrentStake(): Promise<number> {
    return +await this.kingStakingContract.methods.currentStake(this.currentAccount).call({from: this.currentAccount});
  }
}
