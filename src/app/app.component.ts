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
  selectedLand?: Land = undefined;

  lands: Land[] = [];

  constructor(
    private store: Store,
    private web3: Web3Service,
    private landService: LandService,
  ) {
  }

  ngOnInit(): void {
    from(this.detectMetamask()).pipe(take(1)).subscribe();
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      console.log(state);
      this.isInstalled = state.isInstalled;
      this.isConnected = state.isConnected;
      console.log(state);
    });
    this.land$.pipe(untilDestroyed(this)).subscribe((state: LandStateModel) => {
      console.log(state);
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
          console.log(this.lands);
        });
      });
    } catch (err) {
      console.error('Connect metamask fail:', err);
    }
  }
}
