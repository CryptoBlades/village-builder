import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {WalletState, WalletStateModel} from "../../state/wallet/wallet.state";
import {Store} from "@ngxs/store";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);

  walletAddress: string = '';

  constructor(
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.walletAddress = state.publicAddress;
    });
  }

}
