import {Injectable} from '@angular/core';
import {Contract} from "web3-eth-contract";
import {Store} from "@ngxs/store";
import {Web3Service} from "../services/web3.service";
import KingVault from "../../../build/contracts/KingVault.json";
import {UntilDestroy} from "@ngneat/until-destroy";
import {KingService} from "./king.service";

@Injectable({
  providedIn: 'root'
})
@UntilDestroy()
export class KingVaultService extends KingService {

  kingVaultContract!: Contract;

  constructor(
    public override store: Store,
    public override web3: Web3Service,
  ) {
    super(store, web3);
    this.kingVaultContract = new this.web3.eth.Contract(KingVault.abi as any, KingVault.networks["5777"]!.address);
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
