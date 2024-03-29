import {Component, Injectable, OnInit} from '@angular/core';
import {WalletState, WalletStateModel} from "./state/wallet/wallet.state";
import detectEthereumProvider from '@metamask/detect-provider';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Store} from '@ngxs/store';
import {from, Observable, take} from "rxjs";
import {SetMetamaskInstalled} from "./state/wallet/wallet.actions";
import {Web3Service} from "./services/web3.service";
import {LandService, Placement} from "./solidity/land.service";
import {Land} from "./interfaces/land";
import {LandState, LandStateModel} from "./state/land/land.state";
import {SetLandSelected} from "./state/land/land.actions";
import {CharactersService} from "./solidity/characters.service";
import {WeaponsService} from "./solidity/weapons.service";
import {KingService} from "./solidity/king.service";
import {MatDialog} from "@angular/material/dialog";
import {getBuildingTypeName} from './common/common';
import {BuildingType} from "./enums/building-type";
import {KingVaultDialogComponent} from "./components/king-vault-dialog/king-vault-dialog.component";
import {
  SimpleConfirmationDialogComponent
} from "./components/simple-confirmation-dialog/simple-confirmation-dialog.component";
import {SkillService} from "./solidity/skill.service";
import {TranslateService} from '@ngx-translate/core';
import {UserOptionStateModel} from "./state/user-option/user-option.state";
import {environment} from 'src/environments/environment';

export interface Building {
  level: number;
  maxLevel: number;
  type: BuildingType;
  upgrading: boolean;
  canUpgrade: boolean;
  image: string;
  placement: Placement;
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

  kingStakeCompleteTimestamp?: number;
  skillStakeCompleteTimestamp?: number;
  weaponsStakeCompleteTimestamp?: number;
  charactersStakeCompleteTimestamp?: number;
  kingStakePathFinished = false;
  skillStakePathFinished = false;
  weaponsStakePathFinished = false;
  charactersStakePathFinished = false;
  allStakePathsFinished = false;
  isLoading = false;
  kingBalance?: number;
  skillBalance?: number;
  weaponsBalance?: number;
  charactersBalance?: number;
  clayBalance?: number;
  clayUnlocksBalance?: number;
  woodBalance?: number;
  woodUnlocksBalance?: number;
  stoneBalance?: number;
  stoneUnlocksBalance?: number;
  mercenaryBalance?: number;
  mercenaryUnlocksBalance?: number;
  spearmanBalance?: number;
  spearmanUnlocksBalance?: number;
  mageBalance?: number;
  mageUnlocksBalance?: number;
  archerBalance?: number;
  archerUnlocksBalance?: number;
  paladinBalance?: number;
  paladinUnlocksBalance?: number;
  spyBalance?: number;
  spyUnlocksBalance?: number;
  lands: Land[] = [];
  buildings: Building[] = [];

  constructor(
    private store: Store,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private web3: Web3Service,
    private landService: LandService,
    private charactersService: CharactersService,
    private weaponsService: WeaponsService,
    private kingService: KingService,
    private skillService: SkillService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.updateTranslation();
    from(this.detectMetamask()).pipe(take(1)).subscribe();
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.isInstalled = state.isInstalled;
      this.isConnected = state.isConnected;
      this.currentAccount = state.publicAddress;
      this.lands = state.lands;
      this.kingBalance = state.kingBalance;
      this.skillBalance = state.skillBalance;
      this.weaponsBalance = state.weaponsBalance;
      this.charactersBalance = state.charactersBalance;
      if (state.claySkillBalance !== undefined && state.clayWeaponsBalance !== undefined) {
        this.clayBalance = state.claySkillBalance + state.clayWeaponsBalance;
      }
      if (state.claySkillUnlocksBalance !== undefined && state.clayWeaponsUnlocksBalance !== undefined) {
        this.clayUnlocksBalance = state.claySkillUnlocksBalance + state.clayWeaponsUnlocksBalance;
      }
      if (state.woodSkillBalance !== undefined && state.woodWeaponsBalance !== undefined) {
        this.woodBalance = state.woodSkillBalance + state.woodWeaponsBalance;
      }
      if (state.woodSkillUnlocksBalance !== undefined && state.woodWeaponsUnlocksBalance !== undefined) {
        this.woodUnlocksBalance = state.woodSkillUnlocksBalance + state.woodWeaponsUnlocksBalance;
      }
      if (state.stoneSkillBalance !== undefined && state.stoneWeaponsBalance !== undefined) {
        this.stoneBalance = state.stoneSkillBalance + state.stoneWeaponsBalance;
      }
      if (state.stoneSkillUnlocksBalance !== undefined && state.stoneWeaponsUnlocksBalance !== undefined) {
        this.stoneUnlocksBalance = state.stoneSkillUnlocksBalance + state.stoneWeaponsUnlocksBalance;
      }
      this.mercenaryBalance = state.mercenaryBalance;
      this.mercenaryUnlocksBalance = state.mercenaryUnlocksBalance;
      this.spearmanBalance = state.spearmanBalance;
      this.spearmanUnlocksBalance = state.spearmanUnlocksBalance;
      this.mageBalance = state.mageBalance;
      this.mageUnlocksBalance = state.mageUnlocksBalance;
      this.archerBalance = state.archerBalance;
      this.archerUnlocksBalance = state.archerUnlocksBalance;
      this.paladinBalance = state.paladinBalance;
      this.paladinUnlocksBalance = state.paladinUnlocksBalance;
      this.spyBalance = state.spyBalance;
      this.spyUnlocksBalance = state.spyUnlocksBalance;
    });
    this.land$.pipe(untilDestroyed(this)).subscribe(async (state: LandStateModel) => {
      this.selectedLand = state.selectedLand;
      this.buildings = state.buildings;
      console.log(this.buildings);
      await this.loadData();
    });
    try {
      this.isLoading = true;
      await this.loadData();
    } finally {
      this.isLoading = false;
    }
  }

  async loadData(): Promise<void> {
    const [
      kingStakeCompleteTimestamp,
      skillStakeCompleteTimestamp,
      weaponsStakeCompleteTimestamp,
      charactersStakeCompleteTimestamp,
      kingRequiredStakeAmount,
      skillRequiredStakeAmount,
      weaponsRequiredStakeAmount,
      charactersRequiredStakeAmount,
    ] = await Promise.all([
        this.kingService.getStakeCompleteTimestamp(),
        this.skillService.getStakeCompleteTimestamp(),
        this.weaponsService.getStakeCompleteTimestamp(),
        this.charactersService.getStakeCompleteTimestamp(),
        this.kingService.getRequiredStakeAmount(),
        this.skillService.getRequiredStakeAmount(),
        this.weaponsService.getRequiredStakeAmount(),
        this.charactersService.getRequiredStakeAmount()
      ]
    );
    if (kingStakeCompleteTimestamp > Date.now() / 1000) {
      this.kingStakeCompleteTimestamp = kingStakeCompleteTimestamp;
    } else {
      this.kingStakeCompleteTimestamp = undefined;
      this.kingStakePathFinished = !kingRequiredStakeAmount;
    }
    if (skillStakeCompleteTimestamp > Date.now() / 1000) {
      this.skillStakeCompleteTimestamp = skillStakeCompleteTimestamp;
    } else {
      this.skillStakeCompleteTimestamp = undefined;
      this.skillStakePathFinished = !skillRequiredStakeAmount;
    }
    if (weaponsStakeCompleteTimestamp > Date.now() / 1000) {
      this.weaponsStakeCompleteTimestamp = weaponsStakeCompleteTimestamp;
    } else {
      this.weaponsStakeCompleteTimestamp = undefined;
      this.weaponsStakePathFinished = !weaponsRequiredStakeAmount;
    }
    if (charactersStakeCompleteTimestamp > Date.now() / 1000) {
      this.charactersStakeCompleteTimestamp = charactersStakeCompleteTimestamp;
    } else {
      this.charactersStakeCompleteTimestamp = undefined;
      this.charactersStakePathFinished = !charactersRequiredStakeAmount;
    }
    this.allStakePathsFinished = this.kingStakePathFinished && this.skillStakePathFinished && this.weaponsStakePathFinished && this.charactersStakePathFinished;
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
      if (environment.environment === 'TEST' || environment.environment === 'PRODUCTION') {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: environment.chainId}],
          });
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      this.store.dispatch(new SetMetamaskInstalled(false));
    }
  }

  async onClickUnstake() {
    if (!this.selectedLand?.id) return;
    try {
      await this.landService.unstake();
      this.lands = await this.landService.getOwnedLands();
      this.selectedLand = undefined;
    } catch (err) {
      console.error('Unstake fail:', err);
    }
  }

  openKingVaultDialog() {
    this.dialog.open(KingVaultDialogComponent, {
      panelClass: 'king-vault-dialog',
    });
  }

  openUnstakeConfirmationDialog() {
    const dialogRef = this.dialog.open(SimpleConfirmationDialogComponent, {
      data: {
        dialogs: [
          {
            title: 'ConfirmationDialog.DoYouWantToUnstake',
            content: 'ConfirmationDialog.AreYouSureYouKnowWhatYouAreDoing'
          },
          {title: 'ConfirmationDialog.UnstakeIsPermanent', content: 'ConfirmationDialog.YouWontBeAbleToStakeAnymore'},
          {
            title: 'ConfirmationDialog.NoComingBackFromThis',
            content: 'ConfirmationDialog.YouWontBeAbleToComeBackFromThis'
          },
        ]
      }
    });
    dialogRef.afterClosed().subscribe(async confirmed => {
      if (confirmed) {
        await this.onClickUnstake();
      }
      console.log('The dialog was closed', confirmed);
    });
  }

  private updateTranslation() {
    const userOption: UserOptionStateModel = this.store.selectSnapshot(state => state.userOption);
    this.translateService.use(userOption.language);
  }

  get isWallConstructed() {
    return this.buildings.find(building => building.type === BuildingType.WALL)?.level || 0 > 0;
  }
}
