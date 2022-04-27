import {Component, Input, OnInit} from '@angular/core';
import {_filter, getBuildingTypeName, getTimeRemaining} from 'src/app/common/common';
import {Building} from "../../app.component";
import {CharactersService} from "../../solidity/characters.service";
import characterStakingTiers from '../../../assets/staking-tiers/characters.json';
import {StakingTier} from "../../interfaces/staking-tier";
import {Store} from "@ngxs/store";
import {SetCharactersBalance} from "../../state/wallet/wallet.actions";
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
  characterStakingTiers: StakingTier[] = characterStakingTiers;
  nextStakingTier?: StakingTier;

  @Input() building!: Building;
  totalCharactersStaked?: number;
  characters: number[] = [];
  selectedCharacter = new FormControl();
  timeLeft?: string;
  checkInterval?: any;
  charactersRequired?: number;
  barracksRequired?: number;
  unlockedTiers?: number;
  filteredOptions?: Observable<string[]>;

  constructor(
    private charactersService: CharactersService,
    private store: Store,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadCharacters();
    await this.getTimeLeft(+await this.charactersService.getStakeCompleteTimestamp());
    this.filteredOptions = this.selectedCharacter.valueChanges.pipe(
      startWith(''),
      map(value => _filter(value, this.characters)),
    );
  }

  async onStake() {
    if (!this.selectedCharacter.value) return;
    await this.charactersService.stake([this.selectedCharacter.value]);
    console.log('Staked');
    await this.loadCharacters();
    await this.getTimeLeft(+await this.charactersService.getStakeCompleteTimestamp());
    this.selectedCharacter.setValue(undefined);
  }

  async loadCharacters() {
    this.characters = await this.charactersService.getOwnedCharacters();
    this.store.dispatch(new SetCharactersBalance(this.characters.length))
    this.totalCharactersStaked = await this.charactersService.getTotalStaked();
    this.charactersRequired = await this.charactersService.getRequiredStakeAmount();
    this.barracksRequired = await this.charactersService.getNextRequirement();
    this.unlockedTiers = await this.charactersService.getUnlockedTiers();
    this.nextStakingTier = this.characterStakingTiers[this.unlockedTiers];
  }

  getTimeLeft(deadlineTimestamp: number) {
    if (!deadlineTimestamp) return;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.checkInterval = setInterval(async () => {
      const {total, days, hours, minutes, seconds} = getTimeRemaining(deadlineTimestamp.toString());
      this.timeLeft = `${days !== '00' ? `${days}d ` : ''} ${hours !== '00' ? `${hours}h ` : ''} ${minutes}m ${seconds}s`;
      console.log(this.timeLeft);
      if (total <= 1000 && this.checkInterval) {
        clearInterval(this.checkInterval);
        this.timeLeft = '';
        await this.loadCharacters();
      }
    }, 1000);
  }

  get isStakeInProgress() {
    return !!this.timeLeft;
  }

  get getBarracksType() {
    return BuildingType.BARRACKS;
  }

  get isBarracksRequirementMet() {
    return this.building && this.barracksRequired && this.building.level >= this.barracksRequired;
  }

}
