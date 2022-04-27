import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {StakingTier} from "../../interfaces/staking-tier";
import {Building} from "../../app.component";
import {getBuildingTypeName, getTimeRemaining} from 'src/app/common/common';
import weaponStakingTiers from '../../../assets/staking-tiers/weapons.json';
import {CharactersService} from "../../solidity/characters.service";
import {Store} from "@ngxs/store";
import {WeaponsService} from "../../solidity/weapons.service";
import {SetWeaponsBalance} from "../../state/wallet/wallet.actions";
import {map, Observable, startWith} from "rxjs";
import {FormControl} from "@angular/forms";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

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
  ownedWeapons: string[] = [];
  weaponControl = new FormControl();
  timeLeft?: string;
  checkInterval?: any;
  weaponsRequired?: number;
  charactersStakedRequired?: number;
  unlockedTiers?: number;
  charactersUnlockedTiers?: number;
  filteredWeapons?: Observable<string[]>;
  selectedWeapons: string[] = [];

  @ViewChild('weaponInput') weaponInput!: ElementRef<HTMLInputElement>;

  constructor(
    private weaponsService: WeaponsService,
    private charactersService: CharactersService,
    private store: Store,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadWeapons();
    await this.getTimeLeft(+await this.weaponsService.getStakeCompleteTimestamp());
    this.filteredWeapons = this.weaponControl.valueChanges.pipe(
      startWith(null),
      map((weapon: string | null) => (weapon ? this._filter(weapon) : this.ownedWeapons.slice())),
    );
  }

  async onStake() {
    if (!this.selectedWeapons.length) return;
    await this.weaponsService.stake(this.selectedWeapons.map(weapon => +weapon));
    console.log('Staked');
    this.selectedWeapons = [];
    this.weaponInput.nativeElement.value = '';
    this.weaponControl.setValue(null);
    await this.getTimeLeft(+await this.weaponsService.getStakeCompleteTimestamp());
    await this.loadWeapons();
  }

  async loadWeapons() {
    this.ownedWeapons = (await this.weaponsService.getOwnedWeapons()).map(weapon => weapon.toString());
    this.store.dispatch(new SetWeaponsBalance(this.ownedWeapons.length))
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

  get meetsStakeRequirements() {
    return this.charactersStakedRequired! <= this.charactersUnlockedTiers!;
  }

  remove(weapon: string): void {
    const index = this.selectedWeapons.indexOf(weapon);

    if (index >= 0) {
      this.selectedWeapons.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedWeapons.includes(event.option.value) && this.selectedWeapons.length !== this.weaponsRequired) {
      this.selectedWeapons.push(event.option.viewValue);
    }
    this.weaponInput.nativeElement.value = '';
    this.weaponControl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ownedWeapons.filter(weapon => !this.selectedWeapons.includes(weapon)).filter(weapon => weapon.toLowerCase().includes(filterValue));
  }
}
