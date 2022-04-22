import {Injectable} from '@angular/core';
import {SolidityService} from "./solidity.service";

@Injectable({
  providedIn: 'root'
})
export class SkillService extends SolidityService {

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
    return +await this.skillStakingContract.methods.unlockedTiers(this.currentAccount).call({from: this.currentAccount});
  }

  async stake(): Promise<void> {
    const requiredAmount = await this.skillStakingContract.methods.getRequiredStakeAmount().call({from: this.currentAccount});
    await (await this.skillContract).methods.approve(this.skillStakingContract.options.address, requiredAmount).send({from: this.currentAccount});
    await this.skillStakingContract.methods.stake(requiredAmount).send({from: this.currentAccount});
  }

  async claimStakeReward(): Promise<void> {
    await this.skillStakingContract.methods.claimStakeReward().send({from: this.currentAccount});
  }

  async canCompleteStake(): Promise<boolean> {
    return this.skillStakingContract.methods.canCompleteStake().call({from: this.currentAccount});
  }

  async getRequiredStakeAmount(): Promise<number> {
    const amount = await this.skillStakingContract.methods.getRequiredStakeAmount().call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }
}
