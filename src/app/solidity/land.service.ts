import {Injectable} from '@angular/core';
import {Land} from "../interfaces/land";
import {UntilDestroy} from "@ngneat/until-destroy";
import {SolidityService} from "./solidity.service";
import {Building} from "../app.component";
import {BuildingType} from "../enums/building-type";

export interface BuildingRequirements {
  building: BuildingType;
  level: number;
}

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class LandService extends SolidityService {

  async getOwnedLands(address: string): Promise<Land[]> {
    const landsIds = await (await this.landContract).methods.getOwned(address).call();
    return await Promise.all(landsIds.map(async (landId: number) => {
      console.log(landId);
      return this.getLandInfo(+landId);
    }));
  }

  async getLandInfo(id: number): Promise<Land | undefined> {
    try {
      const land = await (await this.landContract).methods.get(id).call();
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
    const isApprovedForAll = await (await this.landContract).methods.isApprovedForAll(this.currentAccount, this.villageContract.options.address).call({from: this.currentAccount});

    if (!isApprovedForAll) {
      await (await this.landContract).methods.approve(this.villageContract.options.address, id).send({from: this.currentAccount});
    }

    return await this.villageContract.methods.stake(id).send({from: this.currentAccount});
  }

  async unstake(): Promise<void> {
    const [
      kingStakingCurrentStake,
      skillStakingCurrentStake,
      characterStakingCurrentStake,
      weaponStakingCurrentStake,
    ] = await Promise.all([
      this.kingStakingContract.methods.currentStake(this.currentAccount).call({from: this.currentAccount}),
      this.skillStakingContract.methods.currentStake(this.currentAccount).call({from: this.currentAccount}),
      this.characterStakingContract.methods.currentStake(this.currentAccount).call({from: this.currentAccount}),
      this.weaponStakingContract.methods.currentStake(this.currentAccount).call({from: this.currentAccount}),
    ]);
    if (kingStakingCurrentStake > 0) {
      await this.kingStakingContract.methods.unstake().send({from: this.currentAccount});
    }
    if (skillStakingCurrentStake > 0) {
      await this.skillStakingContract.methods.unstake().send({from: this.currentAccount});
    }
    if (characterStakingCurrentStake > 0) {
      await this.characterStakingContract.methods.unstake().send({from: this.currentAccount});
    }
    if (weaponStakingCurrentStake > 0) {
      await this.weaponStakingContract.methods.unstake().send({from: this.currentAccount});
    }
    return await this.villageContract.methods.unstake().send({from: this.currentAccount});
  }

  async getStakedLand(): Promise<Land | undefined> {
    const stakedId = +await this.villageContract.methods.stakedLand(this.currentAccount).call({from: this.currentAccount});
    return stakedId !== 0 ? await this.getLandInfo(stakedId) : undefined;
  }

  async getBuildings(): Promise<Building[]> {
    const landId = +await this.villageContract.methods.stakedLand(this.currentAccount).call({from: this.currentAccount});
    const buildings: Building[] = [];
    console.log(landId);
    const currentlyUpgrading = await this.villageContract.methods.currentlyUpgrading(landId).call({from: this.currentAccount});
    for (let buildingType in BuildingType) {
      if (isNaN(Number(buildingType))) {
        return buildings;
      }
      const buildingLevel = await this.villageContract.methods.getBuildingLevel(landId, buildingType).call({from: this.currentAccount});
      const canUpgrade = await this.villageContract.methods.canUpgradeBuilding(landId, buildingType).call({from: this.currentAccount});
      const maxLevel = await this.villageContract.methods.buildingMaxLevel(buildingType).call({from: this.currentAccount});
      buildings.push({
        type: +buildingType,
        level: +buildingLevel,
        maxLevel: +maxLevel,
        upgrading: currentlyUpgrading.building == +buildingType,
        canUpgrade: canUpgrade,
        image: `assets/Village/Buildings/${BuildingType[buildingType]}.png`,
      });
    }
    return buildings;
  }

  async getBuilding(buildingType: BuildingType): Promise<Building> {
    const landId = +await this.villageContract.methods.stakedLand(this.currentAccount).call({from: this.currentAccount});
    const buildingLevel = await this.villageContract.methods.getBuildingLevel(landId, buildingType).call({from: this.currentAccount});
    const currentlyUpgrading = await this.villageContract.methods.currentlyUpgrading(landId).call({from: this.currentAccount});
    const canUpgrade = await this.villageContract.methods.canUpgradeBuilding(landId, buildingType).call({from: this.currentAccount});
    const maxLevel = await this.villageContract.methods.buildingMaxLevel(buildingType).call({from: this.currentAccount});
    const building = {
      type: buildingType,
      level: +buildingLevel,
      maxLevel: +maxLevel,
      upgrading: currentlyUpgrading.building == +buildingType,
      canUpgrade: canUpgrade,
      image: `assets/Village/Buildings/${BuildingType[buildingType]}.png`,
    }
    console.log(building)
    return building;
  }

  async getBuildingRequirements(buildingType: BuildingType): Promise<BuildingRequirements | undefined> {
    const requirement = await this.villageContract.methods.buildingRequirement(buildingType).call({from: this.currentAccount});
    return +requirement.level !== 0 ? {
      building: +requirement.building,
      level: +requirement.level
    } : undefined;
  }

}
