import {Injectable} from '@angular/core';
import {Land} from "../interfaces/land";
import {UntilDestroy} from "@ngneat/until-destroy";
import {SolidityService} from "./solidity.service";
import {Building} from "../app.component";
import {BuildingType} from "./king.service";

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class LandService extends SolidityService {

  selectedLand?: Land;

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

  async getBuildings(): Promise<Building[]> {
    const landId = +await this.villageContract.methods.stakedLand(this.currentAccount).call({from: this.currentAccount});
    const buildings: Building[] = [];
    console.log(landId);
    for (let buildingType in BuildingType) {
      if (isNaN(Number(buildingType))) {
        return buildings;
      }
      console.log(buildingType);
      const building = await this.villageContract.methods.buildings(landId, buildingType).call({from: this.currentAccount});
      const currentlyUpgrading = +await this.villageContract.methods.currentlyUpgrading(landId).call({from: this.currentAccount});
      const canUpgrade = await this.villageContract.methods.canUpgradeBuilding(landId, buildingType).call({from: this.currentAccount});
      buildings.push({
        buildingType: BuildingType[buildingType as keyof typeof BuildingType],
        level: +building[0],
        currentlyUpgrading: currentlyUpgrading == +buildingType,
        canUpgrade: canUpgrade,
      });
    }
    return buildings;
  }

}