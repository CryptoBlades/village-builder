import {Component, Input, OnInit} from '@angular/core';
import {_filter, extractUnitsFromUnlockedTiers, getBuildingTypeName} from 'src/app/common/common';
import {Building} from "../../app.component";
import {CharactersService} from "../../solidity/characters.service";
import charactersStakingTiers from '../../../assets/staking-tiers/characters.json';
import {StakingTier} from "../../interfaces/staking-tier";
import {Store} from "@ngxs/store";
import {
  SetArcherBalance,
  SetBruiserBalance,
  SetCharactersBalance,
  SetMageBalance,
  SetMercenaryBalance,
  SetPaladinBalance
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
  canClaim = false;
  barracksRequired?: number;
  unlockedTiers?: number;
  filteredOptions?: Observable<string[]>;
  stakeCompleteTimestamp?: number;

  constructor(
    private charactersService: CharactersService,
    private store: Store,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.filteredOptions = this.selectedCharacter.valueChanges.pipe(
      startWith(''),
      map(value => _filter(value, this.characters)),
    );
  }

  async onStake() {
    if (!this.selectedCharacter.value) return;
    await this.charactersService.stake([this.selectedCharacter.value]);
    console.log('Staked');
    await this.loadData();
    this.selectedCharacter.setValue(undefined);
  }

  async loadData() {
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
    }
    this.store.dispatch(new SetCharactersBalance(this.characters.length));
    const unlockedCharactersTiers = await this.charactersService.getUnlockedTiers();
    if (unlockedCharactersTiers) {
      const {
        mercenary,
        bruiser,
        mage,
        archer,
        paladin
      } = extractUnitsFromUnlockedTiers(this.charactersStakingTiers, unlockedCharactersTiers);
      this.store.dispatch([
        new SetMercenaryBalance(mercenary),
        new SetBruiserBalance(bruiser),
        new SetMageBalance(mage),
        new SetArcherBalance(archer),
        new SetPaladinBalance(paladin),
      ]);
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
    await this.charactersService.unstake();
    console.log('Unstaked');
    await this.loadData();
  }

  async onClaim() {
    await this.charactersService.claimStakeReward();
    console.log('Claimed');
    await this.loadData();
  }
}
