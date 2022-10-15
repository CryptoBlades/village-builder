import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {WalletState, WalletStateModel} from "../state/wallet/wallet.state";
import {Contract} from "web3-eth-contract";
import {Store} from "@ngxs/store";
import {Web3Service} from "../services/web3.service";
import WeaponStaking from "../../../build/contracts/WeaponStaking.json";
import Weapons from "../../../build/contracts/WeaponsInterface.json";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {environment} from "../../environments/environment";
import {Networks} from "../interfaces/networks";

@Injectable({
  providedIn: 'root'
})
@UntilDestroy()
export class WeaponsService {

  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  weaponsContract!: Promise<Contract>;
  weaponStakingContract!: Contract;

  currentAccount: string = '';

  constructor(
    private store: Store,
    public web3: Web3Service,
  ) {
    this.weaponStakingContract = new this.web3.eth.Contract(WeaponStaking.abi as any, (WeaponStaking.networks as Networks)[environment.networkId]?.address);
    this.weaponsContract = this.weaponStakingContract.methods.nft().call().then((address: string) => {
      return new this.web3.eth.Contract(Weapons.abi as any, address);
    });
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.currentAccount = state.publicAddress;
    });
  }

  async getOwnedWeapons(): Promise<number[]> {
    const amount = await this.getOwnedAmount();
    const weapons = [];
    for (let i = 0; i < amount; i++) {
      const weapon = +await (await this.weaponsContract).methods.tokenOfOwnerByIndex(this.currentAccount, i).call({from: this.currentAccount});
      weapons.push(weapon);
    }
    return weapons;
  }

  async getOwnedAmount(): Promise<number> {
    return +await (await this.weaponsContract).methods.balanceOf(this.currentAccount).call({from: this.currentAccount});
  }

  async stake(ids: number[]): Promise<void> {
    const isApprovedForAll = await (await this.weaponsContract).methods.isApprovedForAll(this.currentAccount, this.weaponStakingContract.options.address).call({from: this.currentAccount});

    if (!isApprovedForAll) {
      await (await this.weaponsContract).methods.setApprovalForAll(this.weaponStakingContract.options.address, true).send({from: this.currentAccount});
    }

    await this.weaponStakingContract.methods.stake(ids).send({from: this.currentAccount});
  }

  async getStakeCompleteTimestamp(): Promise<number> {
    return +await this.weaponStakingContract.methods.getStakeCompleteTimestamp().call({from: this.currentAccount});
  }

  async getTotalStaked(): Promise<number> {
    return +await this.weaponStakingContract.methods.getStakedAmount(this.currentAccount).call({from: this.currentAccount});
  }

  async getRequiredStakeAmount(): Promise<number> {
    return +await this.weaponStakingContract.methods.getRequiredStakeAmount().call({from: this.currentAccount});
  }

  async getNextRequirement(): Promise<number> {
    return +await this.weaponStakingContract.methods.getNextRequirement().call({from: this.currentAccount});
  }

  async getUnlockedTiers(): Promise<number> {
    return +await this.weaponStakingContract.methods.getUnlockedTiers().call({from: this.currentAccount});
  }

  async unstake(): Promise<void> {
    await this.weaponStakingContract.methods.unstake().send({from: this.currentAccount});
  }

  async getCurrentStake(): Promise<number> {
    return +await this.weaponStakingContract.methods.currentStake(this.currentAccount).call({from: this.currentAccount});
  }

  async claimStakeReward(): Promise<void> {
    await this.weaponStakingContract.methods.completeStake().send({from: this.currentAccount});
  }

  async canCompleteStake(): Promise<boolean> {
    return this.weaponStakingContract.methods.canCompleteStake().call({from: this.currentAccount});
  }
}
