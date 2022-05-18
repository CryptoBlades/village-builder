import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {WalletState, WalletStateModel} from "../state/wallet/wallet.state";
import {Contract} from "web3-eth-contract";
import {Store} from "@ngxs/store";
import {Web3Service} from "../services/web3.service";
import KingToken from "../../../build/contracts/KingToken.json";
import KingVault from "../../../build/contracts/KingVault.json";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@Injectable({
  providedIn: 'root'
})
@UntilDestroy()
export class KingVaultService {

  wallet$: Observable<WalletStateModel> = this.store.select(WalletState);
  kingContract!: Promise<Contract>;
  kingStakingContract!: Contract;
  kingVaultContract!: Contract;

  currentAccount: string = '';

  constructor(
    private store: Store,
    public web3: Web3Service,
  ) {
    this.kingContract = this.kingStakingContract.methods.currency().call().then((address: string) => {
      return new this.web3.eth.Contract(KingToken.abi as any, address);
    });
    this.kingVaultContract = new this.web3.eth.Contract(KingVault.abi as any, KingVault.networks["5777"]!.address);
    this.wallet$.pipe(untilDestroyed(this)).subscribe((state: WalletStateModel) => {
      this.currentAccount = state.publicAddress;
    });
  }

  async getTotalInVault(): Promise<number> {
    const amount = await (await this.kingContract).methods.balanceOf(this.kingVaultContract.options.address).call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async getClaimable(): Promise<number> {
    const amount = await this.kingVaultContract.methods.vaults(this.currentAccount).call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async getClaimed(): Promise<number> {
    const amount = await this.kingVaultContract.methods.claimed(this.currentAccount).call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async claimVault(): Promise<void> {
    await this.kingVaultContract.methods.claimVault().send({from: this.currentAccount});
  }

}
