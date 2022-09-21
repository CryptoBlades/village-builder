import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {StakingTier} from "../../interfaces/staking-tier";
import {Building} from "../../app.component";
import {
  extractRewardResourcesFromUnlockedTiers,
  extractUnlocksResourcesFromUnlockedTiers,
  getBuildingTypeName
} from 'src/app/common/common';
import weaponStakingTiers from '../../../assets/staking-tiers/weapons.json';
import {CharactersService} from "../../solidity/characters.service";
import {Store} from "@ngxs/store";
import {WeaponsService} from "../../solidity/weapons.service";
import {
  SetWeaponsBalance,
  SetWeaponsClayBalance, SetWeaponsClayUnlocksBalance,
  SetWeaponsStoneBalance, SetWeaponsStoneUnlocksBalance,
  SetWeaponsWoodBalance, SetWeaponsWoodUnlocksBalance
} from "../../state/wallet/wallet.actions";
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
  canClaim = false;
  unlockedTiers?: number;
  charactersUnlockedTiers?: number;
  filteredWeapons?: Observable<string[]>;
  selectedWeapons: string[] = [];
  stakeCompleteTimestamp?: number;
  currentStake: number = 0;
  isPathFinished = false;
  isInitializing = true;
  isLoading = false;

  @ViewChild('weaponInput') weaponInput!: ElementRef<HTMLInputElement>;

  constructor(
    private weaponsService: WeaponsService,
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
    this.filteredWeapons = this.weaponControl.valueChanges.pipe(
      startWith(null),
      map((weapon: string | null) => (weapon ? this._filter(weapon) : this.ownedWeapons.slice())),
    );
  }

  async onStake() {
    if (!this.selectedWeapons.length) return;
    try {
      this.isLoading = true;
      await this.weaponsService.stake(this.selectedWeapons.map(weapon => +weapon));
      console.log('Staked');
    } finally {
      this.isLoading = false;
    }
    this.selectedWeapons = [];
    this.weaponInput.nativeElement.value = '';
    this.weaponControl.setValue(null);
    await this.loadData();
  }

  async loadData() {
    try {
      this.isLoading = true;
      const [
        ownedWeapons,
        currentStake,
        totalWeaponsStaked,
        weaponsRequired,
        charactersStakedRequired,
        canClaim,
        unlockedTiers,
        charactersUnlockedTiers,
        stakeCompleteTimestamp
      ] = await Promise.all([
        this.weaponsService.getOwnedWeapons(),
        this.weaponsService.getCurrentStake(),
        this.weaponsService.getTotalStaked(),
        this.weaponsService.getRequiredStakeAmount(),
        this.weaponsService.getNextRequirement(),
        this.weaponsService.canCompleteStake(),
        this.weaponsService.getUnlockedTiers(),
        this.charactersService.getUnlockedTiers(),
        this.weaponsService.getStakeCompleteTimestamp(),
      ]);
      this.ownedWeapons = ownedWeapons.map(weapon => weapon.toString());
      this.totalWeaponsStaked = totalWeaponsStaked;
      this.currentStake = currentStake;
      this.weaponsRequired = weaponsRequired;
      this.charactersStakedRequired = charactersStakedRequired;
      this.canClaim = canClaim;
      this.unlockedTiers = unlockedTiers;
      this.charactersUnlockedTiers = charactersUnlockedTiers;
      this.nextStakingTier = this.weaponStakingTiers[this.unlockedTiers];
      if (stakeCompleteTimestamp > Date.now() / 1000) {
        this.stakeCompleteTimestamp = stakeCompleteTimestamp;
      } else {
        this.stakeCompleteTimestamp = undefined;
        this.isPathFinished = !weaponsRequired;
      }
      if (unlockedTiers) {
        const {clay, wood, stone} = extractRewardResourcesFromUnlockedTiers(this.weaponStakingTiers, unlockedTiers);
        const {clay: clayUnlocks, wood: woodUnlocks, stone: stoneUnlocks} = extractUnlocksResourcesFromUnlockedTiers(this.weaponStakingTiers, unlockedTiers);
        this.store.dispatch([
          this.store.dispatch(new SetWeaponsClayBalance(clay)),
          this.store.dispatch(new SetWeaponsWoodBalance(wood)),
          this.store.dispatch(new SetWeaponsStoneBalance(stone)),
          this.store.dispatch(new SetWeaponsClayUnlocksBalance(clayUnlocks)),
          this.store.dispatch(new SetWeaponsWoodUnlocksBalance(woodUnlocks)),
          this.store.dispatch(new SetWeaponsStoneUnlocksBalance(stoneUnlocks)),
        ]);
      }
      this.store.dispatch(new SetWeaponsBalance(this.ownedWeapons.length));
    } finally {
      this.isLoading = false;
    }
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

  async onUnstake() {
    try {
      this.isLoading = true;
      await this.weaponsService.unstake();
      console.log('Unstaked');
    } finally {
      this.isLoading = false;
    }
    await this.loadData();
  }

  async onClaim() {
    try {
      this.isLoading = true;
      await this.weaponsService.claimStakeReward();
      console.log('Claimed');
    } finally {
      this.isLoading = false;
    }
    await this.loadData();
  }
}
