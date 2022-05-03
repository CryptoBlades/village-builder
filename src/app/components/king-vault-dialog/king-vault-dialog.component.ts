import {Component, OnInit} from '@angular/core';
import {KingService} from "../../solidity/king.service";
import {Store} from "@ngxs/store";
import {SetKingBalance} from "../../state/wallet/wallet.actions";
import {KingVaultService} from "../../solidity/king-vault.service";

@Component({
  selector: 'app-king-vault-dialog',
  templateUrl: './king-vault-dialog.component.html',
  styleUrls: ['./king-vault-dialog.component.scss']
})
export class KingVaultDialogComponent implements OnInit {

  totalKingInVault?: number;
  claimableKing?: number;

  constructor(
    private kingService: KingService,
    private kingVaultService: KingVaultService,
    private store: Store,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData() {
    const [totalKingInVault, claimableKing] = await Promise.all([
      this.kingVaultService.getTotalInVault(),
      this.kingVaultService.getClaimable(),
    ]);
    this.totalKingInVault = totalKingInVault;
    this.claimableKing = claimableKing;
    this.store.dispatch(new SetKingBalance(await this.kingService.getOwnedAmount()));
  }

  async onClickClaim() {
    await this.kingVaultService.claimVault();
    await this.loadData();
  }

}
