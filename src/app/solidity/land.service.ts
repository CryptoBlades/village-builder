import {Injectable} from '@angular/core';
import {Land} from "../interfaces/land";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Building} from "../app.component";
import {BuildingType} from "../enums/building-type";
import {Observable} from "rxjs";
import {WalletState, WalletStateModel} from "../state/wallet/wallet.state";
import {Contract} from "web3-eth-contract";
import {Store} from "@ngxs/store";
import {Web3Service} from "../services/web3.service";
import Village from "../../../build/contracts/Village.json";
import CBKLand from "../../../build/contracts/CBKLandInterface.json";
import CharacterStaking from "../../../build/contracts/CharacterStaking.json";
import WeaponStaking from "../../../build/contracts/WeaponStaking.json";
import KingStaking from "../../../build/contracts/KingStaking.json";
import SkillStaking from "../../../build/contracts/SkillStaking.json";

export interface BuildingRequirements {
  building: BuildingType;
  level: number;
}

@Injectable({
  providedIn: 'root'
})
@UntilDestroy()
export class LandService {

  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  landContract!: Promise<Contract>;
  villageContract!: Contract;
  characterStakingContract!: Contract;
  weaponStakingContract!: Contract;
  kingStakingContract!: Contract;
  skillStakingContract!: Contract;

  currentAccount: string = '';

  constructor(
    private store: Store,
    public web3: Web3Service,
  ) {
    this.villageContract = new this.web3.eth.Contract(Village.abi as any, Village.networks["5777"]!.address);
    this.landContract = this.villageContract.methods.cbkLand().call().then((address: string) => {
      return new this.web3.eth.Contract(CBKLand.abi as any, address);
    });
    this.characterStakingContract = new this.web3.eth.Contract(CharacterStaking.abi as any, CharacterStaking.networks["5777"]!.address);
    this.weaponStakingContract = new this.web3.eth.Contract(WeaponStaking.abi as any, WeaponStaking.networks["5777"]!.address);
    this.kingStakingContract = new this.web3.eth.Contract(KingStaking.abi as any, KingStaking.networks["5777"]!.address);
    this.skillStakingContract = new this.web3.eth.Contract(SkillStaking.abi as any, SkillStaking.networks["5777"]!.address);
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.currentAccount = state.publicAddress;
    });
  }

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
      const [buildingLevel, canUpgrade, maxLevel] = await Promise.all([
        this.villageContract.methods.getBuildingLevel(landId, buildingType).call({from: this.currentAccount}),
        this.villageContract.methods.canUpgradeBuilding(landId, buildingType).call({from: this.currentAccount}),
        this.villageContract.methods.buildingMaxLevel(buildingType).call({from: this.currentAccount}),
      ]);

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
    const [buildingLevel, currentlyUpgrading, canUpgrade, maxLevel] = await Promise.all([
      this.villageContract.methods.getBuildingLevel(landId, buildingType).call({from: this.currentAccount}),
      this.villageContract.methods.currentlyUpgrading(landId).call({from: this.currentAccount}),
      this.villageContract.methods.canUpgradeBuilding(landId, buildingType).call({from: this.currentAccount}),
      this.villageContract.methods.buildingMaxLevel(buildingType).call({from: this.currentAccount}),
    ]);
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
