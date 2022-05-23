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
  isPathFinished = false;

  stakeCompleteTimestamp?: number;
  isLoading = false;

  lands: Land[] = [];
  buildings: Building[] = [];

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private web3: Web3Service,
    private landService: LandService,
    private charactersService: CharactersService,
    private weaponsService: WeaponsService,
    private kingService: KingService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    from(this.detectMetamask()).pipe(take(1)).subscribe();
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.isInstalled = state.isInstalled;
      this.isConnected = state.isConnected;
      this.currentAccount = state.publicAddress;
      this.lands = state.lands;
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
          {title: 'Unstake?', content: 'Are you sure you know what you\'re doing?'},
          {title: 'Unstake is permanent', content: 'You won\t be able to stake anymore, are you sure?'},
          {title: 'No coming back', content: 'You won\t be able to come back from this, are you sure?'},
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
}
