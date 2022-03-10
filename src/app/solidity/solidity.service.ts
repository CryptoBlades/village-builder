import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {WalletState, WalletStateModel} from "../state/wallet/wallet.state";
import {LandState, LandStateModel} from "../state/land/land.state";
import {Contract} from "web3-eth-contract";
import {Store} from "@ngxs/store";
import {Web3Service} from "../services/web3.service";
import CBKLand from "../../../build/contracts/CBKLandInterface.json";
import {environment} from "../../environments/environment";
import LandStaking from "../../../build/contracts/LandStaking.json";
import {untilDestroyed} from "@ngneat/until-destroy";

@Injectable({
  providedIn: 'root'
})
export class SolidityService {

  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  land$: Observable<LandStateModel> = this.store.select(LandState);
  landContract!: Contract;
  landStakingContract!: Contract;

  currentAccount: string = '';

  constructor(
    private store: Store,
    private web3: Web3Service,
  ) {
    this.landContract = new this.web3.eth.Contract(CBKLand.abi as any, environment.landContract);
    this.landStakingContract = new this.web3.eth.Contract(LandStaking.abi as any, LandStaking.networks["5777"]!.address);
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.currentAccount = state.publicAddress;
      console.log(state);
    });
  }
}
