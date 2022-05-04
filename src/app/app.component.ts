import {Component, Injectable, OnInit} from '@angular/core';
import {WalletState, WalletStateModel} from "./state/wallet/wallet.state";
import detectEthereumProvider from '@metamask/detect-provider';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Store} from '@ngxs/store';
import {from, Observable, take} from "rxjs";
import {
  SetCharactersBalance,
  SetKingBalance,
  SetMetamaskConnected,
  SetMetamaskInstalled,
  SetSkillBalance,
  SetSkillClayBalance,
  SetSkillStoneBalance,
  SetSkillWoodBalance,
  SetWalletAddress,
  SetWeaponsBalance,
  SetWeaponsClayBalance,
  SetWeaponsStoneBalance,
  SetWeaponsWoodBalance
} from "./state/wallet/wallet.actions";
import {Web3Service} from "./services/web3.service";
import {LandService} from "./solidity/land.service";
import {Land} from "./interfaces/land";
import {LandState, LandStateModel} from "./state/land/land.state";
import {SetLandSelected} from "./state/land/land.actions";
import {CharactersService} from "./solidity/characters.service";
import {WeaponsService} from "./solidity/weapons.service";
import {KingService} from "./solidity/king.service";
import {MatDialog} from "@angular/material/dialog";
import {BuildingDialogComponent} from "./components/building-dialog/building-dialog.component";
import {extractResourcesFromUnlockedTiers, getBuildingTypeName} from './common/common';
import {SkillService} from "./solidity/skill.service";
import {BuildingType} from "./enums/building-type";
import skillStakingTiers from '../assets/staking-tiers/skill.json';
import weaponsStakingTiers from '../assets/staking-tiers/weapons.json';
import {StakingTier} from "./interfaces/staking-tier";
import {KingVaultDialogComponent} from "./components/king-vault-dialog/king-vault-dialog.component";

export interface Building {
  level: number;
  maxLevel: number;
  type: BuildingType;
  upgrading: boolean;
  canUpgrade: boolean;
  image: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@UntilDestroy()
@Injectable()
export class AppComponent implements OnInit {

  getBuildingTypeName = getBuildingTypeName;

  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  land$: Observable<LandStateModel> = this.store.select(LandState);

  isInstalled = false;
  isConnected = false;
  currentAccount = '';
  selectedLand?: Land = undefined;
  characters: number[] = [];
  king: number = 0;

  canCompleteKingStake = false;
  stakeCompleteTimestamp?: number;

  lands: Land[] = [];
  buildings: Building[] = [];

  skillStakingTiers: StakingTier[] = skillStakingTiers;
  weaponsStakingTiers: StakingTier[] = weaponsStakingTiers;

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private web3: Web3Service,
    private landService: LandService,
    private charactersService: CharactersService,
    private weaponsService: WeaponsService,
    private kingService: KingService,
    private skillService: SkillService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    from(this.detectMetamask()).pipe(take(1)).subscribe();
    await this.connectMetamask();
    this.wallet$.pipe(untilDestroyed(this)).subscribe(async (state: WalletStateModel) => {
      this.isInstalled = state.isInstalled;
      this.isConnected = state.isConnected;
      this.currentAccount = state.publicAddress;
      this.canCompleteKingStake = await this.kingService.canCompleteStake();
    });
    this.land$.pipe(untilDestroyed(this)).subscribe(async (state: LandStateModel) => {
      this.selectedLand = state.selectedLand;
      this.buildings = await this.landService.getBuildings();
      console.log(this.buildings);
    });
    const stakeCompleteTimestamp = await this.kingService.getStakeCompleteTimestamp();
    if (stakeCompleteTimestamp > Date.now() / 1000) {
      this.stakeCompleteTimestamp = stakeCompleteTimestamp;
    } else {
      this.stakeCompleteTimestamp = undefined;
    }
    this.king = await this.kingService.getRequiredStakeAmount();
  }

  onSelect(land: Land) {
    this.store.dispatch(new SetLandSelected(land));
    this.selectedLand = land;
    console.log(land);
  }

  async detectMetamask() {
    const provider = await detectEthereumProvider() as any;
    if (provider) {
      this.store.dispatch(new SetMetamaskInstalled(true));
    } else {
      this.store.dispatch(new SetMetamaskInstalled(false));
    }
  }

  async connectMetamask() {
    try {
      const provider = await detectEthereumProvider() as any;
      provider?.request({method: 'eth_requestAccounts'}).then(async (accounts: any) => {
        this.store.dispatch(new SetWalletAddress(this.web3.utils.toChecksumAddress(accounts[0])));
        this.store.dispatch([
          new SetKingBalance(await this.kingService.getOwnedAmount()),
          new SetSkillBalance(await this.skillService.getOwnedAmount()),
          new SetWeaponsBalance(await this.weaponsService.getOwnedAmount()),
          new SetCharactersBalance(await this.charactersService.getOwnedAmount()),
        ]);
        const unlockedSkillTiers = await this.skillService.getUnlockedTiers();
        const unlockedWeaponsTiers = await this.weaponsService.getUnlockedTiers();
        if (unlockedSkillTiers || unlockedWeaponsTiers) {
          console.log(unlockedSkillTiers, unlockedWeaponsTiers);
          const {
            clay: skillClay,
            wood: skillWood,
            stone: skillStone
          } = extractResourcesFromUnlockedTiers(this.skillStakingTiers, unlockedSkillTiers);
          const {
            clay: weaponClay,
            wood: weaponWood,
            stone: weaponStone
          } = extractResourcesFromUnlockedTiers(this.weaponsStakingTiers, unlockedWeaponsTiers);
          this.store.dispatch([
            new SetSkillClayBalance(skillClay),
            new SetSkillWoodBalance(skillWood),
            new SetSkillStoneBalance(skillStone),
            new SetWeaponsClayBalance(weaponClay),
            new SetWeaponsWoodBalance(weaponWood),
            new SetWeaponsStoneBalance(weaponStone),
          ]);
        }
        this.store.dispatch(new SetMetamaskConnected(true));
        this.wallet$.pipe(untilDestroyed(this)).subscribe(async (state: WalletStateModel) => {
          this.lands = await this.landService.getOwnedLands(state.publicAddress)
          const stakedLand = await this.landService.getStakedLand();
          console.log(stakedLand);
          if (stakedLand) {
            this.store.dispatch(new SetLandSelected(stakedLand));
          }
        });
      });
    } catch (err) {
      console.error('Connect metamask fail:', err);
    }
  }

  async onClickUnstake() {
    if (!this.selectedLand?.id) return;
    try {
      await this.landService.unstake();
      this.lands = await this.landService.getOwnedLands(this.currentAccount);
      this.selectedLand = undefined;
    } catch (err) {
      console.error('Unstake fail:', err);
    }
  }

  openBuildingDialog(buildingType: BuildingType) {
    this.dialog.open(BuildingDialogComponent, {
      data: {buildingType},
      panelClass: 'building-dialog',
    });
  }

  openKingVaultDialog() {
    this.dialog.open(KingVaultDialogComponent);
  }
}
