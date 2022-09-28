import {Component, Input, OnInit} from '@angular/core';
import {
  _filter,
  extractRewardUnitsFromUnlockedTiers,
  extractUnlocksUnitsFromUnlockedTiers,
  getBuildingTypeName
} from 'src/app/common/common';
import {Building} from "../../app.component";
import {CharactersService} from "../../solidity/characters.service";
import charactersStakingTiers from '../../../assets/staking-tiers/characters.json';
import {StakingTier} from "../../interfaces/staking-tier";
import {Store} from "@ngxs/store";
import {
  SetArcherBalance, SetArcherUnlocksBalance,
  SetSpearmanBalance, SetSpearmanUnlocksBalance,
  SetCharactersBalance,
  SetMageBalance, SetMageUnlocksBalance,
  SetMercenaryBalance, SetMercenaryUnlocksBalance,
  SetPaladinBalance, SetPaladinUnlocksBalance, SetSpyBalance, SetSpyUnlocksBalance
} from "../../state/wallet/wallet.actions";
import {BuildingType} from "../../enums/building-type";
import {map, Observable, startWith} from "rxjs";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-character-staking',
  templateUrl: './character-staking.component.html',
  styleUrls: ['./character-staking.component.scss']
})
export class CharacterStakingComponent implements OnInit {
  getBuildingTypeName = getBuildingTypeName;
  charactersStakingTiers: StakingTier[] = charactersStakingTiers;
  nextStakingTier?: StakingTier;

  @Input() building!: Building;
  totalCharactersStaked?: number;
  characters: number[] = [];
  selectedCharacter = new FormControl();
  charactersRequired?: number;
  currentStake: number = 0;
  isPathFinished = false;
  canClaim = false;
  barracksRequired?: number;
  unlockedTiers?: number;
  filteredOptions?: Observable<string[]>;
  stakeCompleteTimestamp?: number;
  isInitializing = true;
  isLoading = false;

  constructor(
    private charactersService: CharactersService,
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
    this.filteredOptions = this.selectedCharacter.valueChanges.pipe(
      startWith(''),
      map(value => _filter(value, this.characters)),
    );
  }

  async onStake() {
    if (!this.selectedCharacter.value) return;
    try {
      this.isLoading = true;
      await this.charactersService.stake([this.selectedCharacter.value]);
      console.log('Staked');
    } finally {
      this.isLoading = false;
    }
    await this.loadData();
    this.selectedCharacter.setValue(undefined);
  }

  async loadData() {
    try {
      this.isLoading = true;
      const [
        ownedCharacters,
        currentStake,
        totalCharactersStaked,
        charactersRequired,
        barracksRequired,
        unlockedTiers,
        canClaim,
        stakeCompleteTimestamp
      ] = await Promise.all([
        this.charactersService.getOwnedCharacters(),
        this.charactersService.getCurrentStake(),
        this.charactersService.getTotalStaked(),
        this.charactersService.getRequiredStakeAmount(),
        this.charactersService.getNextRequirement(),
        this.charactersService.getUnlockedTiers(),
        this.charactersService.canCompleteStake(),
        this.charactersService.getStakeCompleteTimestamp(),
      ]);
      this.characters = ownedCharacters;
      console.log(ownedCharacters);
      this.currentStake = currentStake;
      this.totalCharactersStaked = totalCharactersStaked;
      this.charactersRequired = charactersRequired;
      this.barracksRequired = barracksRequired;
      this.unlockedTiers = unlockedTiers;
      this.canClaim = canClaim;
      this.nextStakingTier = this.charactersStakingTiers[this.unlockedTiers];
      if (stakeCompleteTimestamp > Date.now() / 1000) {
        this.stakeCompleteTimestamp = stakeCompleteTimestamp;
      } else {
        this.stakeCompleteTimestamp = undefined;
        this.isPathFinished = !charactersRequired;
      }
      this.store.dispatch(new SetCharactersBalance(this.characters.length));
      const unlockedCharactersTiers = await this.charactersService.getUnlockedTiers();
      if (unlockedCharactersTiers) {
        const {
          mercenary,
          spearman,
          mage,
          archer,
          paladin,
          spy,
        } = extractRewardUnitsFromUnlockedTiers(this.charactersStakingTiers, unlockedCharactersTiers);
        const {
          mercenary: mercenaryUnlocks,
          spearman: spearmanUnlocks,
          mage: mageUnlocks,
          archer: archerUnlocks,
          paladin: paladinUnlocks,
          spy: spyUnlocks,
        } = extractUnlocksUnitsFromUnlockedTiers(this.charactersStakingTiers, unlockedCharactersTiers);
        this.store.dispatch([
          new SetMercenaryBalance(mercenary),
          new SetSpearmanBalance(spearman),
          new SetMageBalance(mage),
          new SetArcherBalance(archer),
          new SetPaladinBalance(paladin),
          new SetSpyBalance(spy),
          new SetMercenaryUnlocksBalance(mercenaryUnlocks),
          new SetSpearmanUnlocksBalance(spearmanUnlocks),
          new SetMageUnlocksBalance(mageUnlocks),
          new SetArcherUnlocksBalance(archerUnlocks),
          new SetPaladinUnlocksBalance(paladinUnlocks),
          new SetSpyUnlocksBalance(spyUnlocks),
        ]);
      }
    } finally {
      this.isLoading = false;
    }
  }

  get isStakeInProgress() {
    return !!this.stakeCompleteTimestamp;
  }

  get getBarracksType() {
    return BuildingType.BARRACKS;
  }

  get isBarracksRequirementMet() {
    return this.building && this.barracksRequired && this.building.level >= this.barracksRequired;
  }

  async onUnstake() {
    try {
      this.isLoading = true;
      await this.charactersService.unstake();
      console.log('Unstaked');
    } finally {
      this.isLoading = false;
    }
    await this.loadData();
  }

  async onClaim() {
    try {
      this.isLoading = true;
      await this.charactersService.claimStakeReward();
      console.log('Claimed');
    } finally {
      this.isLoading = false;
    }
    await this.loadData();
  }
}
