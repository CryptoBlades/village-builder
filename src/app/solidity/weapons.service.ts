import {Injectable} from '@angular/core';
import {SolidityService} from "./solidity.service";

@Injectable({
  providedIn: 'root'
})
export class WeaponsService extends SolidityService {

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

    if (ids.length === 1 && !isApprovedForAll) {
      await (await this.weaponsContract).methods.approve(this.weaponStakingContract.options.address, ids[0]).send({from: this.currentAccount});
    } else if (!isApprovedForAll) {
      await (await this.weaponsContract).methods.setApprovalForAll(this.weaponStakingContract.options.address, true).send({from: this.currentAccount});
    }

    await this.weaponStakingContract.methods.stake(ids).send({from: this.currentAccount});
  }

  async getStakeCompleteTimestamp(): Promise<number> {
    return +await this.weaponStakingContract.methods.getStakeCompleteTimestamp().call({from: this.currentAccount});
  }

  async getTotalStaked(): Promise<number> {
    return +await this.weaponStakingContract.methods.getStakedNftsAmount(this.currentAccount).call({from: this.currentAccount});
  }

  async getRequiredStakeAmount(): Promise<number> {
    return +await this.weaponStakingContract.methods.getRequiredStakeAmount().call({from: this.currentAccount});
  }

  async getNextRequirement(): Promise<number> {
    return +await this.weaponStakingContract.methods.getNextRequirement().call({from: this.currentAccount});
  }

  async getUnlockedTiers(): Promise<number> {
    return +await this.weaponStakingContract.methods.unlockedTiers(this.currentAccount).call({from: this.currentAccount});
  }

}
