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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@UntilDestroy()
@Injectable()
export class AppComponent implements OnInit {
  title = 'Cryptoblades Kingdoms Village Builder';

  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  land$: Observable<LandStateModel> = this.store.select(LandState);

  isInstalled = false;
  isConnected = false;
  currentAccount = '';
  selectedLand?: Land = undefined;
  characters: number[] = [];
  characterToStake = '';

  lands: Land[] = [];

  constructor(
    private store: Store,
    private web3: Web3Service,
    private landService: LandService,
    private charactersService: CharactersService,
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
  }

  async onClickStake() {
    await this.charactersService.stake(+this.characterToStake);
    console.log('Staked');
  }
}
