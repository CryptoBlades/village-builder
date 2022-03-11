import {Injectable} from '@angular/core';
import {Land} from "../interfaces/land";
import {UntilDestroy} from "@ngneat/until-destroy";
import {SolidityService} from "./solidity.service";

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class LandService extends SolidityService {

  async getOwnedLands(address: string): Promise<Land[]> {
    const landsIds = await this.landContract.methods.getOwned(address).call();
    return await Promise.all(landsIds.map(async (landId: number) => {
      console.log(landId);
      return this.getLandInfo(+landId);
    }));
  }

  async getLandInfo(id: number): Promise<Land | undefined> {
    try {
      const land = await this.landContract.methods.get(id).call();
      console.log(land);
      return {
        id: id,
        tier: +land[0],
        chunkID: +land[1],
        resellerAddress: land[4]
      } as Land;
    } catch (e) {
      return;
    }
  }

  async stakeLand(id: number): Promise<void> {
    const isApprovedForAll = await this.landContract.methods.isApprovedForAll(this.currentAccount, this.villageContract.options.address).call({from: this.currentAccount});

    if (!isApprovedForAll) {
      await this.landContract.methods.approve(this.villageContract.options.address, id).send({from: this.currentAccount});
    }

    return await this.villageContract.methods.stake(id).send({from: this.currentAccount});
  }

  async unstakeLand(id: number): Promise<void> {
    return await this.villageContract.methods.unstake(id).send({from: this.currentAccount});
  }

  async hasStakedLand(): Promise<boolean> {
    const stakedId = +await this.villageContract.methods.stakedLand(this.currentAccount).call({from: this.currentAccount});
    return stakedId !== 0;
  }

  async getStakedLand(): Promise<Land | undefined> {
    const stakedId = +await this.villageContract.methods.stakedLand(this.currentAccount).call({from: this.currentAccount});
    return stakedId !== 0 ? await this.getLandInfo(stakedId) : undefined;
  }

}
