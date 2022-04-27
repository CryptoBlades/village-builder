import {Component, Inject, Input, OnInit} from '@angular/core';
import {Building} from "../../app.component";
import {getBuildingTypeName, getTimeRemaining} from 'src/app/common/common';
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
  timeLeft?: string;
  timeLeftCheckInterval?: any;
  totalSkillStaked?: number;
  skillRequired?: number;
  unlockedTiers?: number;
  kingStakingTierRequired?: number;
  kingUnlockedTiers?: number;
  canClaim = false;
  skillStakingTiers: StakingTier[] = skillStakingTiers;

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
    await this.loadBuilding();
    await this.getTimeLeft(+await this.skillService.getStakeCompleteTimestamp());
  }

  async loadBuilding(): Promise<void> {
    this.building = await this.landService.getBuilding(this.data.buildingType);
    this.totalSkillStaked = await this.skillService.getTotalStaked();
    this.unlockedTiers = await this.skillService.getUnlockedTiers();
    this.canClaim = await this.skillService.canCompleteStake();
    this.skillRequired = await this.skillService.getRequiredStakeAmount();
    this.kingStakingTierRequired = await this.skillService.getNextRequirement();
    this.kingUnlockedTiers = await this.kingService.getUnlockedTiers();
    const unlockedSkillTiers = await this.skillService.getUnlockedTiers();
    if (unlockedSkillTiers) {
      const resources = Array.from(this.skillStakingTiers.slice(0, unlockedSkillTiers)
        .flatMap(tier => tier.rewards).filter(reward => reward.type !== 'KING').reduce(
          (m, {type, amount}) => m.set(type, (m.get(type) || 0) + amount), new Map
        ), ([type, amount]) => ({type, amount}));
      this.store.dispatch(new SetClayBalance(resources.find(resource => resource.type === 'Clay')?.amount));
      this.store.dispatch(new SetWoodBalance(resources.find(resource => resource.type === 'Wood')?.amount));
      this.store.dispatch(new SetStoneBalance(resources.find(resource => resource.type === 'Stone')?.amount));
    }
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

  async onStake() {
    await this.skillService.stake();
    this.store.dispatch(new SetSkillBalance(await this.skillService.getOwnedAmount()))
    console.log('Staked');
    await this.loadBuilding();
    await this.getTimeLeft(+await this.skillService.getStakeCompleteTimestamp());
  }

  async onClaim() {
    await this.skillService.claimStakeReward();
    console.log('Claimed');
    await this.loadBuilding();
  }

  get isStakeInProgress() {
    return !!this.timeLeft;
  }

  get meetsStakeRequirements() {
    return this.kingStakingTierRequired! <= this.kingUnlockedTiers!;
  }

}
