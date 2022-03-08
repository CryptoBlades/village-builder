import {Injectable} from '@angular/core';
import MockLand from '../../../build/contracts/MockCBKLand.json';
import {environment} from 'src/environments/environment';
import {Contract} from 'web3-eth-contract';
import {Land} from "../interfaces/land";
import {Web3Service} from "../services/web3.service";

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

  async getOwnedLands(address: string): Promise<Land[]> {
    const landsIds = await this.landContract.methods.getOwned(address).call();
    return await Promise.all(landsIds.map(async (landId: number) => {
      return this.getLandInfo(+landId);
    }));
  }

  async getLandInfo(id: number): Promise<Land | undefined>{
    try {
      const land = await this.landContract.methods.get(id).call();

      return {
        id: id,
        tier: +land[0],
        chunkID: +land[2],
        resellerAddress: land[5]
      } as Land;
    } catch (e) {
      return;
    }
  }
}
