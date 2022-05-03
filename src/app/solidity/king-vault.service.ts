import {Injectable} from '@angular/core';
import {SolidityService} from "./solidity.service";

@Injectable({
  providedIn: 'root'
})
export class KingVaultService extends SolidityService {

  async getTotalInVault(): Promise<number> {
    const amount = await (await this.kingContract).methods.balanceOf(this.kingVaultContract.options.address).call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async getClaimable(): Promise<number> {
    const amount = await this.kingVaultContract.methods.vaults(this.currentAccount).call({from: this.currentAccount});
    return +this.web3.utils.fromWei(amount, 'ether');
  }

  async claimVault(): Promise<void> {
    await this.kingVaultContract.methods.claimVault().send({from: this.currentAccount});
  }

}
