import {Component, Inject, Input, OnInit} from '@angular/core';
import {Building} from "../../app.component";
import {extractResourcesFromUnlockedTiers, getBuildingTypeName} from 'src/app/common/common';
import {StakingTier} from "../../interfaces/staking-tier";
import skillStakingTiers from '../../../assets/staking-tiers/skill.json';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {BuildingType} from "../../enums/building-type";
import {LandService} from "../../solidity/land.service";
import {CharactersService} from "../../solidity/characters.service";
import {Store} from "@ngxs/store";
import {SkillService} from "../../solidity/skill.service";
import {
  SetSkillBalance,
  SetSkillClayBalance,
  SetSkillStoneBalance,
  SetSkillWoodBalance
} from "../../state/wallet/wallet.actions";
import {KingService} from "../../solidity/king.service";

@Component({
  selector: 'app-skill-staking',
  templateUrl: './skill-staking.component.html',
  styleUrls: ['./skill-staking.component.scss']
})
export class SkillStakingComponent implements OnInit {
  getBuildingTypeName = getBuildingTypeName;

  @Input() building!: Building;
  totalSkillStaked?: number;
  skillRequired?: number;
  unlockedTiers?: number;
  kingStakingTierRequired?: number;
  kingUnlockedTiers?: number;
  canClaim = false;
  skillStakingTiers: StakingTier[] = skillStakingTiers;
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
    private skillService: SkillService,
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
        totalSkillStaked,
        skillOwned,
        unlockedTiers,
        canClaim,
        skillRequired,
        kingStakingTierRequired,
        skillUnlockedTiers,
        kingUnlockedTiers,
        stakeCompleteTimestamp
      ] = await Promise.all([
        this.landService.getBuilding(this.data.buildingType),
        this.skillService.getCurrentStake(),
        this.skillService.getTotalStaked(),
        this.skillService.getOwnedAmount(),
        this.skillService.getUnlockedTiers(),
        this.skillService.canCompleteStake(),
        this.skillService.getRequiredStakeAmount(),
        this.skillService.getNextRequirement(),
        this.skillService.getUnlockedTiers(),
        this.kingService.getUnlockedTiers(),
        this.skillService.getStakeCompleteTimestamp(),
      ]);
      this.building = building;
      this.currentStake = currentStake;
      this.totalSkillStaked = totalSkillStaked;
      this.unlockedTiers = unlockedTiers;
      this.canClaim = canClaim;
      this.skillRequired = skillRequired;
      this.kingStakingTierRequired = kingStakingTierRequired;
      this.kingUnlockedTiers = kingUnlockedTiers;
      this.nextStakingTier = this.skillStakingTiers[this.unlockedTiers];
      if (stakeCompleteTimestamp > Date.now() / 1000) {
        this.stakeCompleteTimestamp = stakeCompleteTimestamp;
      } else {
        this.stakeCompleteTimestamp = undefined;
        this.isPathFinished = !skillRequired;
      }
      if (skillUnlockedTiers) {
        const {clay, wood, stone} = extractResourcesFromUnlockedTiers(this.skillStakingTiers, skillUnlockedTiers);
        this.store.dispatch([
          this.store.dispatch(new SetSkillClayBalance(clay)),
          this.store.dispatch(new SetSkillWoodBalance(wood)),
          this.store.dispatch(new SetSkillStoneBalance(stone)),
        ]);
      }
      this.store.dispatch(new SetSkillBalance(skillOwned));
    } finally {
      this.isLoading = false;
    }
  }

  async onStake() {
    try {
      this.isLoading = true;
      await this.skillService.stake();
      this.store.dispatch(new SetSkillBalance(await this.skillService.getOwnedAmount()))
      console.log('Staked');
    } finally {
      this.isLoading = false;
    }
    await this.loadData();
  }

  async onClaim() {
    try {
      this.isLoading = true;
      await this.skillService.claimStakeReward();
      console.log('Claimed');
    } finally {
      this.isLoading = false;
    }
    await this.loadData();
  }

  get isStakeInProgress() {
    return !!this.stakeCompleteTimestamp;
  }

  get meetsStakeRequirements() {
    return this.kingStakingTierRequired! <= this.kingUnlockedTiers!;
  }

  async onUnstake() {
    try {
      this.isLoading = true;
      await this.skillService.unstake();
      console.log('Unstaked');
    } finally {
      this.isLoading = false;
    }
    await this.loadData();
  }
}
