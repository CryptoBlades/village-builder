import {Component, Injectable, OnInit} from '@angular/core';
import {WalletState, WalletStateModel} from "./state/wallet/wallet.state";
import detectEthereumProvider from '@metamask/detect-provider';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Store} from '@ngxs/store';
import {from, Observable, take} from "rxjs";
import {SetMetamaskInstalled, SetWalletAddress} from "./state/wallet/wallet.actions";
import {Web3Service} from "./services/web3.service";

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

  isInstalled = false;
  isConnected = false;

  constructor(
    private store: Store,
    private web3: Web3Service,
  ) {
  }

  ngOnInit(): void {
    from(this.detectMetamask()).pipe(take(1)).subscribe();

    this.wallet$.pipe(
      untilDestroyed(this)
    ).subscribe((state: WalletStateModel) => {
      this.isInstalled = state.isInstalled;
      this.isConnected = state.isConnected;
    });

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
      if (provider) {
        const accounts = await provider.request({method: 'eth_requestAccounts'});

        if (typeof window.ethereum !== 'undefined') {
          this.store.dispatch(new SetWalletAddress(this.web3.utils.toChecksumAddress(accounts[0])));
          this.wallet$.subscribe(wallet => {
            console.log(wallet);
          });
        }
      }
    } catch (err) {
      console.error('Connect metamask fail:', err);
    }
  }
}
