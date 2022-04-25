import {Component, Input, OnInit} from '@angular/core';
import {StakingTier} from "../../interfaces/staking-tier";
import {Building} from "../../app.component";
import {getBuildingTypeName, getTimeRemaining} from 'src/app/common/common';
import weaponStakingTiers from '../../../assets/staking-tiers/weapons.json';
import {CharactersService} from "../../solidity/characters.service";
import {Store} from "@ngxs/store";
import {WeaponsService} from "../../solidity/weapons.service";
import {SetWeaponsBalance} from "../../state/wallet/wallet.actions";
import {BuildingType} from "../../enums/building-type";

@Component({
  selector: 'app-weapon-staking',
  templateUrl: './weapon-staking.component.html',
  styleUrls: ['./weapon-staking.component.scss']
})
export class WeaponStakingComponent implements OnInit {

  getBuildingTypeName = getBuildingTypeName;
  weaponStakingTiers: StakingTier[] = weaponStakingTiers;

  @Input() building!: Building;
  totalWeaponsStaked?: number;
  weapons: number[] = [];
  selectedWeapon?: number;
  timeLeft?: string;
  checkInterval?: any;
  weaponsRequired?: number;
  charactersStakedRequired?: number;
  unlockedTiers?: number;
  charactersUnlockedTiers?: number;

  constructor(
    private weaponsService: WeaponsService,
    private charactersService: CharactersService,
    private store: Store,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadWeapons();
    await this.getTimeLeft(+await this.weaponsService.getStakeCompleteTimestamp());
  }

  async onStake() {
    if (!this.selectedWeapon) return;
    await this.weaponsService.stake([this.selectedWeapon]);
    console.log('Staked');
    await this.loadWeapons();
    await this.getTimeLeft(+await this.weaponsService.getStakeCompleteTimestamp());
    this.selectedWeapon = undefined;
  }

  async loadWeapons() {
    this.weapons = await this.weaponsService.getOwnedWeapons();
    this.store.dispatch(new SetWeaponsBalance(this.weapons.length))
    this.totalWeaponsStaked = await this.weaponsService.getTotalStaked();
    this.weaponsRequired = await this.weaponsService.getRequiredStakeAmount();
    this.charactersStakedRequired = await this.weaponsService.getNextRequirement();
    this.unlockedTiers = await this.weaponsService.getUnlockedTiers();
    this.charactersUnlockedTiers = await this.charactersService.getUnlockedTiers();
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
        await this.loadWeapons();
      }
    }, 1000);
  }

  get isStakeInProgress() {
    return !!this.timeLeft;
  }

  get getBarracksType() {
    return BuildingType.BARRACKS;
  }

  get meetsStakeRequirements() {
    return this.charactersStakedRequired! <= this.charactersUnlockedTiers!;
  }
}
