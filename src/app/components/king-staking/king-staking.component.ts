import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Building} from "../../app.component";
import {BuildingRequirements, LandService} from "../../solidity/land.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {KingService} from "../../solidity/king.service";
import {CharactersService} from "../../solidity/characters.service";
import {getBuildingTypeName} from 'src/app/common/common';
import {StakingTier} from "../../interfaces/staking-tier";
import kingStakingTiers from '../../../assets/staking-tiers/king.json';
import {Store} from "@ngxs/store";
import {SetKingBalance} from "../../state/wallet/wallet.actions";
import {BuildingType} from "../../enums/building-type";
import {SetBuildings} from "../../state/land/land.actions";

@Component({
  selector: 'app-king-staking',
  templateUrl: './king-staking.component.html',
  styleUrls: ['./king-staking.component.scss']
})
export class KingStakingComponent implements OnInit {
  getBuildingTypeName = getBuildingTypeName;

  @Input() building!: Building;
  @Output() onLoadData: EventEmitter<any> = new EventEmitter();
  canClaim = false;
  buildingRequirements?: BuildingRequirements;
  kingRequired?: number;
  totalKingStaked?: number;
  unlockedTiers?: number;
  kingStakingTiers: StakingTier[] = kingStakingTiers;
  nextStakingTier?: StakingTier;
  stakeCompleteTimestamp?: number;
  currentStake: number = 0;
  isPathFinished = false;
  isInitializing = true;
  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { buildingType: BuildingType },
    private landService: LandService,
    private charactersService: CharactersService,
    private kingService: KingService,
    private store: Store,
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.isInitializing = true;
      await this.loadData();
    } finally {
      this.isInitializing = false;
    }
  }

  async loadData(): Promise<void> {
    try {
      this.isLoading = true;
      const [
        building,
        currentStake,
        buildingRequirements,
        kingRequired,
        totalKingStaked,
        unlockedTiers,
        stakeCompleteTimestamp
      ] = await Promise.all([
        this.landService.getBuilding(this.data.buildingType),
        this.kingService.getCurrentStake(),
        this.landService.getBuildingRequirements(this.data.buildingType),
        this.kingService.getRequiredStakeAmount(),
        this.kingService.getTotalStaked(),
        this.kingService.getUnlockedTiers(),
        this.kingService.getStakeCompleteTimestamp(),
      ]);
      this.building = building;
      this.currentStake = currentStake;
      this.buildingRequirements = buildingRequirements;
      this.kingRequired = kingRequired;
      this.totalKingStaked = totalKingStaked;
      this.unlockedTiers = unlockedTiers;
      this.nextStakingTier = this.kingStakingTiers[this.unlockedTiers];
      if (stakeCompleteTimestamp > Date.now() / 1000) {
        this.stakeCompleteTimestamp = stakeCompleteTimestamp;
      } else {
        this.stakeCompleteTimestamp = undefined;
        this.isPathFinished = !kingRequired;
      }
      this.canClaim = await this.kingService.canCompleteStake();
      this.onLoadData.emit();
    } finally {
      this.isLoading = false;
    }
  }

  async onClaim() {
    try {
      this.isLoading = true;
      await this.kingService.claimStakeReward()
      this.store.dispatch(new SetBuildings(await this.landService.getBuildings()));
      console.log('Claimed');
    } finally {
      this.isLoading = false;
    }
    await this.loadData();
  }

  async onStake() {
    if (!this.building) return;
    try {
      this.isLoading = true;
      await this.kingService.stake(this.building?.type);
      this.store.dispatch(new SetKingBalance(await this.kingService.getOwnedAmount()));
      this.store.dispatch(new SetBuildings(await this.landService.getBuildings()));
      console.log('Staked');
    } finally {
      this.isLoading = false;
    }
    await this.loadData();
  }

  async onUnstake() {
    try {
      this.isLoading = true;
      await this.kingService.unstake();
      this.store.dispatch(new SetKingBalance(await this.kingService.getOwnedAmount()));
      this.store.dispatch(new SetBuildings(await this.landService.getBuildings()));
      console.log('Unstaked');
    } finally {
      this.isLoading = false;
    }
    await this.loadData();
  }

  get isMaxLevel() {
    return this.building && (this.building.level >= this.building.maxLevel);
  }

  get isStakeInProgress() {
    return !!this.stakeCompleteTimestamp;
  }

  get isBuilt() {
    return this.building && (this.building.level > 0);
  }

}
