import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {WalletState, WalletStateModel} from "../../state/wallet/wallet.state";
import {Store} from "@ngxs/store";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {LandState, LandStateModel} from "../../state/land/land.state";
import {Land} from "../../interfaces/land";

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  land$: Observable<LandStateModel> = this.store.select(LandState);

  walletAddress: string = '';
  kingBalance: number = 0;
  skillBalance: number = 0;
  weaponsBalance: number = 0;
  charactersBalance: number = 0;
  clayBalance: number = 0;
  woodBalance: number = 0;
  stoneBalance: number = 0;
  mercenaryBalance: number = 0;
  bruiserBalance: number = 0;
  mageBalance: number = 0;
  archerBalance: number = 0;
  paladinBalance: number = 0;
  land?: Land;

  constructor(
    private store: Store,
  ) {
  }

  ngOnInit(): void {
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.walletAddress = state.publicAddress;
      this.kingBalance = state.kingBalance;
      this.skillBalance = state.skillBalance;
      this.weaponsBalance = state.weaponsBalance;
      this.charactersBalance = state.charactersBalance;
      this.clayBalance = state.claySkillBalance + state.clayWeaponsBalance;
      this.woodBalance = state.woodSkillBalance + state.woodWeaponsBalance;
      this.stoneBalance = state.stoneSkillBalance + state.stoneWeaponsBalance;
      this.mercenaryBalance = state.mercenaryBalance;
      this.bruiserBalance = state.bruiserBalance;
      this.mageBalance = state.mageBalance;
      this.archerBalance = state.archerBalance;
      this.paladinBalance = state.paladinBalance;
    });
    this.land$.pipe(untilDestroyed(this)).subscribe((state: LandStateModel) => {
      this.land = state.selectedLand;
    });
  }

  get formattedWalletAddress() {
    let firstFiveChars = this.walletAddress.slice(0, 5);
    let lastFourChars = this.walletAddress.slice(this.walletAddress.length - 4);
    return firstFiveChars + "..." + lastFourChars;
  }

}
