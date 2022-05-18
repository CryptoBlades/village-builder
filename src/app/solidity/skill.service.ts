import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {WalletState, WalletStateModel} from "../state/wallet/wallet.state";
import {Contract} from "web3-eth-contract";
import {Store} from "@ngxs/store";
import {Web3Service} from "../services/web3.service";
import SkillStaking from "../../../build/contracts/SkillStaking.json";
import SkillToken from "../../../build/contracts/SkillInterface.json";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@Injectable({
  providedIn: 'root'
})
@UntilDestroy()
export class SkillService {

  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  skillContract!: Promise<Contract>;
  skillStakingContract!: Contract;

  currentAccount: string = '';

  constructor(
    private store: Store,
    public web3: Web3Service,
  ) {
    this.skillStakingContract = new this.web3.eth.Contract(SkillStaking.abi as any, SkillStaking.networks["5777"]!.address);
    this.skillContract = this.skillStakingContract.methods.currency().call().then((address: string) => {
      return new this.web3.eth.Contract(SkillToken.abi as any, address);
    });
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.currentAccount = state.publicAddress;

    });
  }

  async getOwnedAmount(): Promise<number> {
    const amount = await (await this.skillContract).methods.balanceOf(this.currentAccount).call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async getStakeCompleteTimestamp(): Promise<number> {
    return +await this.skillStakingContract.methods.getStakeCompleteTimestamp().call({from: this.currentAccount});
  }

  async getTotalStaked(): Promise<number> {
    const amount = await this.skillStakingContract.methods.stakedCurrencies(this.currentAccount).call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async getUnlockedTiers(): Promise<number> {
    return +await this.skillStakingContract.methods.getUnlockedTiers().call({from: this.currentAccount});
  }

  async stake(): Promise<void> {
    const requiredAmount = await this.skillStakingContract.methods.getRequiredStakeAmount().call({from: this.currentAccount});
    await (await this.skillContract).methods.approve(this.skillStakingContract.options.address, requiredAmount).send({from: this.currentAccount});
    await this.skillStakingContract.methods.stake(requiredAmount).send({from: this.currentAccount});
  }

  async claimStakeReward(): Promise<void> {
    await this.skillStakingContract.methods.completeStake().send({from: this.currentAccount});
  }

  async canCompleteStake(): Promise<boolean> {
    return this.skillStakingContract.methods.canCompleteStake().call({from: this.currentAccount});
  }

  async getRequiredStakeAmount(): Promise<number> {
    const amount = await this.skillStakingContract.methods.getRequiredStakeAmount().call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async getNextRequirement(): Promise<number> {
    return +await this.skillStakingContract.methods.getNextRequirement().call({from: this.currentAccount});
  }

  async unstake() {
    await this.skillStakingContract.methods.unstake().send({from: this.currentAccount});
  }

  async getCurrentStake(): Promise<number> {
    return +await this.skillStakingContract.methods.currentStake(this.currentAccount).call({from: this.currentAccount});
  }
}
