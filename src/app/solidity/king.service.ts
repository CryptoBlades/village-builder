import {Injectable} from '@angular/core';
import {SolidityService} from "./solidity.service";

//TODO: Extract to separate class
export enum BuildingType {
  TOWN_HALL = 1, HEADQUARTERS, BARRACKS, CLAY_PIT, IRON_MINE, STONE_MINE, STOREHOUSE, SMITHY, FARM, HIDDEN_STASH, WALL, TRADING_POST
}

@Injectable({
  providedIn: 'root'
})
export class KingService extends SolidityService {

  async getOwnedAmount(): Promise<number> {
    const amount = await this.kingContract.methods.balanceOf(this.currentAccount).call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async stake(buildingType: BuildingType): Promise<void> {
    const requiredAmount = await this.kingStakingContract.methods.getRequiredStakeAmount().call({from: this.currentAccount});
    await this.kingContract.methods.approve(this.kingStakingContract.options.address, requiredAmount).send({from: this.currentAccount});
    await this.kingStakingContract.methods.stake(requiredAmount, buildingType).send({from: this.currentAccount});
  }

  async getStakeCompleteTimestamp(): Promise<number> {
    return +await this.kingStakingContract.methods.getStakeCompleteTimestamp().call({from: this.currentAccount});
  }

  async getRequiredStakeAmount(): Promise<number> {
    const amount = await this.kingStakingContract.methods.getRequiredStakeAmount().call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async canCompleteStake(): Promise<boolean> {
    return this.kingStakingContract.methods.canCompleteStake().call({from: this.currentAccount});
  }

  async claimStakeReward(): Promise<void> {
    await this.kingStakingContract.methods.claimStakeReward().send({from: this.currentAccount});
  }

}
