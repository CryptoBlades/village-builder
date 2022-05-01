import {Component, Inject, Input, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-king-staking',
  templateUrl: './king-staking.component.html',
  styleUrls: ['./king-staking.component.scss']
})
export class KingStakingComponent implements OnInit {
  getBuildingTypeName = getBuildingTypeName;

  @Input() building!: Building;
  canClaim = false;
  buildingRequirements?: BuildingRequirements;
  kingRequired?: number;
  totalKingStaked?: number;
  unlockedTiers?: number;
  kingStakingTiers: StakingTier[] = kingStakingTiers;
  nextStakingTier?: StakingTier;
  stakeCompleteTimestamp?: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { buildingType: BuildingType },
    private landService: LandService,
    private charactersService: CharactersService,
    private kingService: KingService,
    private store: Store,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.building = await this.landService.getBuilding(this.data.buildingType);
    this.buildingRequirements = await this.landService.getBuildingRequirements(this.data.buildingType);
    if (this.building.upgrading) {
      this.canClaim = await this.kingService.canCompleteStake();
    }
    this.kingRequired = await this.kingService.getRequiredStakeAmount();
    this.totalKingStaked = await this.kingService.getTotalStaked();
    this.unlockedTiers = await this.kingService.getUnlockedTiers();
    const stakeCompleteTimestamp = await this.kingService.getStakeCompleteTimestamp();
    if (stakeCompleteTimestamp > Date.now() / 1000) {
      this.stakeCompleteTimestamp = stakeCompleteTimestamp;
    } else {
      this.stakeCompleteTimestamp = undefined;
    }
    this.nextStakingTier = this.kingStakingTiers[this.unlockedTiers];
  }

  async onClaim() {
    await this.kingService.claimStakeReward();
    console.log('Claimed');
    await this.loadData();
  }

  async onStake() {
    if (!this.building) return;
    await this.kingService.stake(this.building?.type);
    this.store.dispatch(new SetKingBalance(await this.kingService.getOwnedAmount()))
    console.log('Staked');
    await this.loadData();
  }

  async onUnstake() {
    await this.kingService.unstake();
    console.log('Unstaked');
    await this.loadData();
  }

  get isMaxLevel() {
    return this.building && (this.building.level >= this.building.maxLevel);
  }

  get isStakeInProgress() {
    return this.building?.upgrading && !!this.stakeCompleteTimestamp;
  }

  get isBuilt() {
    return this.building && (this.building.level > 0);
  }

}
