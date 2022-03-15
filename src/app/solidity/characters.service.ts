import {Injectable} from '@angular/core';
import {SolidityService} from "./solidity.service";

@Injectable({
  providedIn: 'root'
})
export class CharactersService extends SolidityService {

  async getOwnedCharacters(): Promise<number[]> {
    const numberOfCharacters = +await this.charactersContract.methods.balanceOf(this.currentAccount).call({from: this.currentAccount});
    const characters = [];
    for (let i = 0; i < numberOfCharacters; i++) {
      const character = +await this.charactersContract.methods.tokenOfOwnerByIndex(this.currentAccount, i).call({from: this.currentAccount});
      characters.push(character);
    }
    return characters;
  }

  async stake(ids: number[]): Promise<void> {
    const isApprovedForAll = await this.charactersContract.methods.isApprovedForAll(this.currentAccount, this.characterStakingContract.options.address).call({from: this.currentAccount});

    if (ids.length === 1 && !isApprovedForAll) {
      await this.charactersContract.methods.approve(this.characterStakingContract.options.address, ids[0]).send({from: this.currentAccount});
    } else if (!isApprovedForAll) {
      await this.charactersContract.methods.setApprovalForAll(this.characterStakingContract.options.address, true).send({from: this.currentAccount});
    }

    await this.characterStakingContract.methods.stake(ids).send({from: this.currentAccount});
  }

  async getStakeCompleteTimestamp(): Promise<number> {
    return +await this.characterStakingContract.methods.getStakeCompleteTimestamp().call({from: this.currentAccount});
  }

}