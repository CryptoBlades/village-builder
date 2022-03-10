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
}
