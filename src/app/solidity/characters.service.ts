import {Injectable} from '@angular/core';
import {SolidityService} from "./solidity.service";

@Injectable({
  providedIn: 'root'
})
export class CharactersService extends SolidityService {

  async getOwnedCharacters(): Promise<number[]> {
    const numberOfCharacters = await this.getOwnedAmount();
    const characters = [];
    for (let i = 0; i < numberOfCharacters; i++) {
      const character = +await (await this.charactersContract).methods.tokenOfOwnerByIndex(this.currentAccount, i).call({from: this.currentAccount});
      characters.push(character);
    }
    return characters;
  }

  async getOwnedAmount(): Promise<number> {
    return +await (await this.charactersContract).methods.balanceOf(this.currentAccount).call({from: this.currentAccount});
  }

  async stake(ids: number[]): Promise<void> {
    const isApprovedForAll = await (await this.charactersContract).methods.isApprovedForAll(this.currentAccount, this.characterStakingContract.options.address).call({from: this.currentAccount});

    if (ids.length === 1 && !isApprovedForAll) {
      const idOwner = await (await this.charactersContract).methods.ownerOf(ids[0]).call({from: this.currentAccount});
      if (idOwner === this.currentAccount) {
        await (await this.charactersContract).methods.approve(this.characterStakingContract.options.address, ids[0]).send({from: this.currentAccount});
      }
    } else if (!isApprovedForAll) {
      await (await this.charactersContract).methods.setApprovalForAll(this.characterStakingContract.options.address, true).send({from: this.currentAccount});
    }

    await this.characterStakingContract.methods.stake(ids).send({from: this.currentAccount});
  }

  async getStakeCompleteTimestamp(): Promise<number> {
    return +await this.characterStakingContract.methods.getStakeCompleteTimestamp().call({from: this.currentAccount});
  }

  async getTotalStaked(): Promise<number> {
    return +await this.characterStakingContract.methods.getStakedNftsAmount(this.currentAccount).call({from: this.currentAccount});
  }

  async getRequiredStakeAmount(): Promise<number> {
    return +await this.characterStakingContract.methods.getRequiredStakeAmount().call({from: this.currentAccount});
  }

  async getNextRequirement(): Promise<number> {
    return +await this.characterStakingContract.methods.getNextRequirement().call({from: this.currentAccount});
  }

  async getUnlockedTiers(): Promise<number> {
    return +await this.characterStakingContract.methods.getUnlockedTiers().call({from: this.currentAccount});
  }

  async unstake(): Promise<void> {
    await this.characterStakingContract.methods.unstake().send({from: this.currentAccount});
  }

  async getCurrentStake(): Promise<number> {
    return +await this.characterStakingContract.methods.currentStake(this.currentAccount).call({from: this.currentAccount});
  }

  async claimStakeReward(): Promise<void> {
    await this.characterStakingContract.methods.completeStake().send({from: this.currentAccount});
  }

  async canCompleteStake(): Promise<boolean> {
    return this.characterStakingContract.methods.canCompleteStake().call({from: this.currentAccount});
  }
}
