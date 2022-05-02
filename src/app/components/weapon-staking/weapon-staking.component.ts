import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {StakingTier} from "../../interfaces/staking-tier";
import {Building} from "../../app.component";
import {getBuildingTypeName} from 'src/app/common/common';
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
  nextStakingTier?: StakingTier;

  @Input() building!: Building;
  totalWeaponsStaked?: number;
  ownedWeapons: string[] = [];
  weaponControl = new FormControl();
  weaponsRequired?: number;
  charactersStakedRequired?: number;
  unlockedTiers?: number;
  charactersUnlockedTiers?: number;
  filteredWeapons?: Observable<string[]>;
  selectedWeapons: string[] = [];
  stakeCompleteTimestamp?: number;

  @ViewChild('weaponInput') weaponInput!: ElementRef<HTMLInputElement>;

  constructor(
    private weaponsService: WeaponsService,
    private charactersService: CharactersService,
    private store: Store,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
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
    await this.loadData();
  }

  async loadData() {
    const [
      ownedWeapons,
      totalWeaponsStaked,
      weaponsRequired,
      charactersStakedRequired,
      unlockedTiers,
      charactersUnlockedTiers,
      stakeCompleteTimestamp
    ] = await Promise.all([
      this.weaponsService.getOwnedWeapons(),
      this.weaponsService.getTotalStaked(),
      this.weaponsService.getRequiredStakeAmount(),
      this.weaponsService.getNextRequirement(),
      this.weaponsService.getUnlockedTiers(),
      this.charactersService.getUnlockedTiers(),
      this.weaponsService.getStakeCompleteTimestamp(),
    ]);
    this.ownedWeapons = ownedWeapons.map(weapon => weapon.toString());
    this.totalWeaponsStaked = totalWeaponsStaked;
    this.weaponsRequired = weaponsRequired;
    this.charactersStakedRequired = charactersStakedRequired;
    this.unlockedTiers = unlockedTiers;
    this.charactersUnlockedTiers = charactersUnlockedTiers;
    this.nextStakingTier = this.weaponStakingTiers[this.unlockedTiers];
    if (stakeCompleteTimestamp > Date.now() / 1000) {
      this.stakeCompleteTimestamp = stakeCompleteTimestamp;
    } else {
      this.stakeCompleteTimestamp = undefined;
    }
    this.store.dispatch(new SetWeaponsBalance(this.ownedWeapons.length))
  }

  get isStakeInProgress() {
    return !!this.stakeCompleteTimestamp;
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
