import {Component, Injectable, OnInit} from '@angular/core';
import {WalletState, WalletStateModel} from "./state/wallet/wallet.state";
import detectEthereumProvider from '@metamask/detect-provider';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Store} from '@ngxs/store';
import {from, Observable, take} from "rxjs";
import {SetMetamaskConnected, SetMetamaskInstalled, SetWalletAddress} from "./state/wallet/wallet.actions";
import {Web3Service} from "./services/web3.service";
import {LandService} from "./solidity/land.service";
import {Land} from "./interfaces/land";
import {LandState, LandStateModel} from "./state/land/land.state";
import {SetLandSelected} from "./state/land/land.actions";
import {CharactersService} from "./solidity/characters.service";
import {WeaponsService} from "./solidity/weapons.service";
import {Building, KingService} from "./solidity/king.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@UntilDestroy()
@Injectable()
export class AppComponent implements OnInit {

  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  land$: Observable<LandStateModel> = this.store.select(LandState);

  isInstalled = false;
  isConnected = false;
  currentAccount = '';
  selectedLand?: Land = undefined;
  characters: number[] = [];
  charactersToStake = '';
  weapons: number[] = [];
  weaponsToStake = '';
  king: number = 0;
  kingToStake = '';

  timeLeft = '';
  checkInterval: any = null;

  lands: Land[] = [];

  constructor(
    private store: Store,
    private web3: Web3Service,
    private landService: LandService,
    private charactersService: CharactersService,
    private weaponsService: WeaponsService,
    private kingService: KingService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    from(this.detectMetamask()).pipe(take(1)).subscribe();
    await this.connectMetamask();
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.isInstalled = state.isInstalled;
      this.isConnected = state.isConnected;
      this.currentAccount = state.publicAddress;
    });
    this.land$.pipe(untilDestroyed(this)).subscribe((state: LandStateModel) => {
      this.selectedLand = state.selectedLand;
    });
    await this.getTimeLeft(+await this.weaponsService.getStakeCompleteTimestamp());
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
      provider?.request({method: 'eth_requestAccounts'}).then((accounts: any) => {
        this.store.dispatch(new SetWalletAddress(this.web3.utils.toChecksumAddress(accounts[0])));
        this.store.dispatch(new SetMetamaskConnected(true));
        this.wallet$.pipe(untilDestroyed(this)).subscribe(async (state: WalletStateModel) => {
          this.lands = await this.landService.getOwnedLands(state.publicAddress)
          const stakedLand = await this.landService.getStakedLand();
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

  async onClickFetch() {
    this.characters = await this.charactersService.getOwnedCharacters();
    console.log(this.characters);
    await this.getTimeLeft(+await this.charactersService.getStakeCompleteTimestamp());
  }

  async onClickStake() {
    const ids = [...this.charactersToStake].map((value: string | number) => +value);
    await this.charactersService.stake(ids);
    console.log('Staked');
  }

  async onClickFetchWeap() {
    this.weapons = await this.weaponsService.getOwnedWeapons();
    console.log(this.weapons);
    await this.getTimeLeft(+await this.weaponsService.getStakeCompleteTimestamp());
  }

  async onClickStakeWeap() {
    const ids = [...this.weaponsToStake].map((value: string | number) => +value);
    await this.weaponsService.stake(ids);
    console.log('Staked');
  }

  async onClickFetchKing() {
    this.king = await this.kingService.getOwnedAmount();
    console.log(this.king);
    await this.getTimeLeft(+await this.kingService.getStakeCompleteTimestamp());
  }

  async onClickStakeKing() {
    await this.kingService.stake(+this.kingToStake, Building.TOWN_HALL);
    console.log('Staked');
  }

  getTimeLeft(deadlineTimestamp: number) {
    if (!deadlineTimestamp) return;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.checkInterval = setInterval(() => {
      const {total, days, hours, minutes, seconds} = this.getTimeRemaining(deadlineTimestamp.toString());
      this.timeLeft = `${days !== '00' ? `${days}d ` : ''} ${hours !== '00' ? `${hours}h ` : ''} ${minutes}m ${seconds}s`;
      console.log(this.timeLeft);
      if (total <= 1000 && this.checkInterval) {
        clearInterval(this.checkInterval);
        this.timeLeft = '';
      }
    }, 1000);
  }

  getTimeRemaining = (end: string) => {
    const total = new Date(+end * 1000).getTime() - new Date().getTime();
    let seconds: string | number = Math.floor((total / 1000) % 60);
    let minutes: string | number = Math.floor((total / 1000 / 60) % 60);
    let hours: string | number = Math.floor((total / (1000 * 60 * 60)) % 24);
    let days: string | number = Math.floor((total / (1000 * 60 * 60 * 24)));
    if (seconds < 10) {
      seconds = String(seconds).padStart(2, '0');
    }
    if (minutes < 10) {
      minutes = String(minutes).padStart(2, '0');
    }
    if (hours < 10) {
      hours = String(hours).padStart(2, '0');
    }
    if (days < 10) {
      days = String(days).padStart(2, '0');
    }

    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  };
}
