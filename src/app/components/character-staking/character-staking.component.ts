import {Component, Input, OnInit} from '@angular/core';
import {getBuildingTypeName, getTimeRemaining} from 'src/app/common/common';
import {Building} from "../../app.component";
import {CharactersService} from "../../solidity/characters.service";
import {BuildingType} from "../../solidity/king.service";
import characterStakingTiers from '../../../assets/json/character-staking.json';

enum RequirementType {
  BARRACKS = 'Barracks'
}

enum UnitType {
  MERCENARY = 'Mercenary',
  BRUISER = 'Bruiser',
  MAGE = 'Mage',
  ARCHER = 'Archer',
  PALADIN = 'Paladin',
}

interface CharacterStakingTier {
  duration: number;
  amount: number;
  requirement: {
    type: RequirementType;
    amount: number;
  };
  rewards: {
    type: UnitType;
    amount: number;
  }[];
  unlocks: {
    type: UnitType;
    amount: number;
  }[];
}

@Component({
  selector: 'app-character-staking',
  templateUrl: './character-staking.component.html',
  styleUrls: ['./character-staking.component.scss']
})
export class CharacterStakingComponent implements OnInit {
  getBuildingTypeName = getBuildingTypeName;
  characterStakingTiers: CharacterStakingTier[] = characterStakingTiers as CharacterStakingTier[];

  @Input() building?: Building;
  totalCharactersStaked?: number;
  characters: number[] = [];
  selectedCharacter?: number;
  timeLeft?: string;
  checkInterval?: any;
  charactersRequired?: number;
  barracksRequired?: number;
  unlockedTiers?: number;

  constructor(
    private charactersService: CharactersService
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadCharacters();
    await this.getTimeLeft(+await this.charactersService.getStakeCompleteTimestamp());
    console.log(characterStakingTiers);
  }

  async onStake() {
    if (!this.selectedCharacter) return;
    await this.charactersService.stake([this.selectedCharacter]);
    console.log('Staked');
    await this.loadCharacters();
    await this.getTimeLeft(+await this.charactersService.getStakeCompleteTimestamp());
    this.selectedCharacter = undefined;
  }

  async loadCharacters() {
    this.characters = await this.charactersService.getOwnedCharacters();
    this.totalCharactersStaked = await this.charactersService.getTotalStaked();
    this.charactersRequired = await this.charactersService.getRequiredStakeAmount();
    this.barracksRequired = await this.charactersService.getRequiredBarracksLevel();
    this.unlockedTiers = +await this.charactersService.getUnlockedTiers();
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
