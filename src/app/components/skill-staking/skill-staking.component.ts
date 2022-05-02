import {Component, Inject, Input, OnInit} from '@angular/core';
import {Building} from "../../app.component";
import {getBuildingTypeName} from 'src/app/common/common';
import {StakingTier} from "../../interfaces/staking-tier";
import skillStakingTiers from '../../../assets/staking-tiers/skill.json';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {BuildingType} from "../../enums/building-type";
import {LandService} from "../../solidity/land.service";
import {CharactersService} from "../../solidity/characters.service";
import {Store} from "@ngxs/store";
import {SkillService} from "../../solidity/skill.service";
import {SetClayBalance, SetSkillBalance, SetStoneBalance, SetWoodBalance} from "../../state/wallet/wallet.actions";
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
    await this.loadData();
  }

  async loadData(): Promise<void> {
    const [
      building,
      totalSkillStaked,
      unlockedTiers,
      canClaim,
      skillRequired,
      kingStakingTierRequired,
      skillUnlockedTiers,
      kingUnlockedTiers,
      stakeCompleteTimestamp
    ] = await Promise.all([
      this.landService.getBuilding(this.data.buildingType),
      this.skillService.getTotalStaked(),
      this.skillService.getUnlockedTiers(),
      this.skillService.canCompleteStake(),
      this.skillService.getRequiredStakeAmount(),
      this.skillService.getNextRequirement(),
      this.skillService.getUnlockedTiers(),
      this.kingService.getUnlockedTiers(),
      this.skillService.getStakeCompleteTimestamp(),
    ]);
    this.building = building;
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
    }
    if (skillUnlockedTiers) {
      const resources = Array.from(this.skillStakingTiers.slice(0, skillUnlockedTiers)
        .flatMap(tier => tier.rewards).filter(reward => reward.type !== 'KING').reduce(
          (m, {type, amount}) => m.set(type, (m.get(type) || 0) + amount), new Map
        ), ([type, amount]) => ({type, amount}));
      this.store.dispatch(new SetClayBalance(resources.find(resource => resource.type === 'Clay')?.amount));
      this.store.dispatch(new SetWoodBalance(resources.find(resource => resource.type === 'Wood')?.amount));
      this.store.dispatch(new SetStoneBalance(resources.find(resource => resource.type === 'Stone')?.amount));
    }
  }

  async onStake() {
    await this.skillService.stake();
    this.store.dispatch(new SetSkillBalance(await this.skillService.getOwnedAmount()))
    console.log('Staked');
    await this.loadData();
  }

  async onClaim() {
    await this.skillService.claimStakeReward();
    console.log('Claimed');
    await this.loadData();
  }

  get isStakeInProgress() {
    return !!this.stakeCompleteTimestamp;
  }

  get meetsStakeRequirements() {
    return this.kingStakingTierRequired! <= this.kingUnlockedTiers!;
  }

  async onUnstake() {
    await this.skillService.unstake();
    console.log('Unstaked');
    await this.loadData();
  }
}
