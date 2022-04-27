import {Component, Injectable, OnInit} from '@angular/core';
import {WalletState, WalletStateModel} from "./state/wallet/wallet.state";
import detectEthereumProvider from '@metamask/detect-provider';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Store} from '@ngxs/store';
import {from, Observable, take} from "rxjs";
import {
  SetCharactersBalance,
  SetClayBalance,
  SetKingBalance,
  SetMetamaskConnected,
  SetMetamaskInstalled,
  SetSkillBalance,
  SetStoneBalance,
  SetWalletAddress,
  SetWeaponsBalance,
  SetWoodBalance
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
import {getBuildingTypeName, getTimeRemaining} from './common/common';
import {SkillService} from "./solidity/skill.service";
import {BuildingType} from "./enums/building-type";
import skillStakingTiers from '../assets/staking-tiers/skill.json';
import {StakingTier} from "./interfaces/staking-tier";

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

  timeLeft = '';
  kingTimeLeft = '';
  checkInterval: any = null;
  kingCheckInterval: any = null;
  canCompleteKingStake = false;

  lands: Land[] = [];
  buildings: Building[] = [];

  skillStakingTiers: StakingTier[] = skillStakingTiers;

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
    await this.getKingTimeLeft(+await this.kingService.getStakeCompleteTimestamp());
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
        this.store.dispatch(new SetKingBalance(await this.kingService.getOwnedAmount()));
        this.store.dispatch(new SetSkillBalance(await this.skillService.getOwnedAmount()));
        this.store.dispatch(new SetWeaponsBalance(await this.weaponsService.getOwnedAmount()));
        this.store.dispatch(new SetCharactersBalance(await this.charactersService.getOwnedAmount()));
        const unlockedSkillTiers = await this.skillService.getUnlockedTiers();
        if (unlockedSkillTiers) {
          const resources = Array.from(this.skillStakingTiers.slice(0, unlockedSkillTiers)
            .flatMap(tier => tier.rewards).filter(reward => reward.type !== 'KING').reduce(
              (m, {type, amount}) => m.set(type, (m.get(type) || 0) + amount), new Map
            ), ([type, amount]) => ({type, amount}));
          this.store.dispatch(new SetClayBalance(resources.find(resource => resource.type === 'Clay')?.amount));
          this.store.dispatch(new SetWoodBalance(resources.find(resource => resource.type === 'Wood')?.amount));
          this.store.dispatch(new SetStoneBalance(resources.find(resource => resource.type === 'Stone')?.amount));
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
      await this.landService.unstakeLand(this.selectedLand.id);
      this.lands = await this.landService.getOwnedLands(this.currentAccount);
      this.selectedLand = undefined;
    } catch (err) {
      console.error('Unstake fail:', err);
    }
  }

  getKingTimeLeft(deadlineTimestamp: number) {
    if (!deadlineTimestamp) return;
    if (this.kingCheckInterval) {
      clearInterval(this.kingCheckInterval);
    }
    this.kingCheckInterval = setInterval(async () => {
      const {total, days, hours, minutes, seconds} = getTimeRemaining(deadlineTimestamp.toString());
      this.kingTimeLeft = `${days !== '00' ? `${days}d ` : ''} ${hours !== '00' ? `${hours}h ` : ''} ${minutes}m ${seconds}s`;
      console.log(this.kingTimeLeft);
      if (total <= 1000 && this.kingCheckInterval) {
        clearInterval(this.kingCheckInterval);
        this.kingTimeLeft = '';
        this.canCompleteKingStake = await this.kingService.canCompleteStake();
        this.buildings = await this.landService.getBuildings();
      }
    }, 1000);
  }

  getTimeLeft(deadlineTimestamp: number) {
    if (!deadlineTimestamp) return;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.checkInterval = setInterval(() => {
      const {total, days, hours, minutes, seconds} = getTimeRemaining(deadlineTimestamp.toString());
      this.timeLeft = `${days !== '00' ? `${days}d ` : ''} ${hours !== '00' ? `${hours}h ` : ''} ${minutes}m ${seconds}s`;
      console.log(this.timeLeft);
      if (total <= 1000 && this.checkInterval) {
        clearInterval(this.checkInterval);
        this.timeLeft = '';
      }
    }, 1000);
  }

  openBuildingModal(buildingType: BuildingType) {
    this.dialog.open(BuildingDialogComponent, {
      data: {buildingType},
      panelClass: 'building-dialog',
      height: '80vh',
      width: '80vw',
    });
  }
}
