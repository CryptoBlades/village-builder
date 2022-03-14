import {Injectable} from '@angular/core';
import {SolidityService} from "./solidity.service";

//TODO: Extract to separate class
export enum Building {
  NONE, TOWN_HALL, HEADQUARTERS, BARRACKS, CLAY_PIT, IRON_MINE, STONE_MINE, STOREHOUSE, SMITHY, FARM, HIDDEN_STASH, WALL, TRADING_POST
}

@Injectable({
  providedIn: 'root'
})
export class KingService extends SolidityService {

  async getOwnedAmount(): Promise<number> {
    const amount = await this.kingContract.methods.balanceOf(this.currentAccount).call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async stake(amount: number, building: Building): Promise<void> {
    const weiAmount = this.web3.utils.toWei(amount.toString(), 'ether');
    await this.kingContract.methods.approve(this.kingStakingContract.options.address, weiAmount).send({from: this.currentAccount});
    await this.kingStakingContract.methods.stake(weiAmount, building).send({from: this.currentAccount});
  }

  async getStakeCompleteTimestamp(): Promise<number> {
    return +await this.kingStakingContract.methods.getStakeCompleteTimestamp().call({from: this.currentAccount});
  }

}
