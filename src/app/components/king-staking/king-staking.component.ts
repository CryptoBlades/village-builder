import {Component, Inject, Input, OnInit} from '@angular/core';
import {Building} from "../../app.component";
import {BuildingRequirements, LandService} from "../../solidity/land.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {KingService} from "../../solidity/king.service";
import {CharactersService} from "../../solidity/characters.service";
import {getBuildingTypeName, getTimeRemaining} from 'src/app/common/common';
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
  timeLeft?: string;
  timeLeftCheckInterval?: any;
  canClaim = false;
  buildingRequirements?: BuildingRequirements;
  kingRequired?: number;
  totalKingStaked?: number;
  unlockedTiers?: number;
  kingStakingTiers: StakingTier[] = kingStakingTiers;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { buildingType: BuildingType },
    private landService: LandService,
    private charactersService: CharactersService,
    private kingService: KingService,
    private store: Store,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.buildingRequirements = await this.landService.getBuildingRequirements(this.data.buildingType);
    await this.loadBuilding();
    await this.getTimeLeft(+await this.kingService.getStakeCompleteTimestamp());
  }

  async loadBuilding(): Promise<void> {
    this.building = await this.landService.getBuilding(this.data.buildingType);
    if (this.building.upgrading) {
      this.canClaim = await this.kingService.canCompleteStake();
    }
    this.kingRequired = await this.kingService.getRequiredStakeAmount();
    this.totalKingStaked = await this.kingService.getTotalStaked();
    this.unlockedTiers = await this.kingService.getUnlockedTiers();
  }

  getTimeLeft(deadlineTimestamp: number) {
    if (!deadlineTimestamp) return;
    if (this.timeLeftCheckInterval) {
      clearInterval(this.timeLeftCheckInterval);
    }
    this.timeLeftCheckInterval = setInterval(async () => {
      const {total, days, hours, minutes, seconds} = getTimeRemaining(deadlineTimestamp.toString());
      this.timeLeft = `${days !== '00' ? `${days}d ` : ''} ${hours !== '00' ? `${hours}h ` : ''} ${minutes}m ${seconds}s`;
      console.log(this.timeLeft);
      if (total <= 1000 && this.timeLeftCheckInterval) {
        clearInterval(this.timeLeftCheckInterval);
        this.timeLeft = '';
        await this.loadBuilding();
      }
    }, 1000);
  }


  async onClaim() {
    await this.kingService.claimStakeReward();
    console.log('Claimed');
    await this.loadBuilding();
  }

  async onStake() {
    if (!this.building) return;
    await this.kingService.stake(this.building?.type);
    this.store.dispatch(new SetKingBalance(await this.kingService.getOwnedAmount()))
    console.log('Staked');
    await this.loadBuilding();
    await this.getTimeLeft(+await this.kingService.getStakeCompleteTimestamp());
  }

  get isMaxLevel() {
    return this.building && (this.building.level >= this.building.maxLevel);
  }

  get isUpgradeInProgress() {
    return this.building?.upgrading && !!this.timeLeft;
  }

  get isBuilt() {
    return this.building && (this.building.level > 0);
  }

  get isBarracks() {
    return this.building?.type === BuildingType.BARRACKS;
  }

}
