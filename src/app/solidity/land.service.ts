import {Injectable} from '@angular/core';
import {Web3Service} from '../web3.service';
import MockLand from '../../../../../../contracts/build/contracts/CBKLand.json';
import {environment} from 'src/environments/environment';
import {Contract} from 'web3-eth-contract';
import {Land} from "../interfaces/land";

@Injectable({
  providedIn: 'root'
})
export class LandService {

  landContract!: Contract;

  constructor(
    private web3: Web3Service
  ) {
    this.landContract = new this.web3.eth.Contract(MockLand.abi as any, environment.landContract);
  }

  async getOwned(address: string): Promise<Array<string>> {
    return await this.landContract.methods.getOwned(address).call();
  }

  async getLandInfo(id: number): Promise<Land | null> {
    try {
      const t2 = await this.landContract.methods.get(id).call();
      console.log(t2);

      return GetLandMapper(t2);
    } catch (e) {
      return null;
    }
  }
}
