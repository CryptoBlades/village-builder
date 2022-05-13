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
  claimedKing?: number;
  isInitializing = true;
  isLoading = false;

  constructor(
    private kingService: KingService,
    private kingVaultService: KingVaultService,
    private store: Store,
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.isInitializing = true;
      await this.loadData();
    } finally {
      this.isInitializing = false;
    }
  }

  async loadData() {
    try {
      this.isLoading = true;
      const [totalKingInVault, claimableKing, claimedKing] = await Promise.all([
        this.kingVaultService.getTotalInVault(),
        this.kingVaultService.getClaimable(),
        this.kingVaultService.getClaimed(),
      ]);
      this.totalKingInVault = totalKingInVault;
      this.claimableKing = claimableKing;
      this.claimedKing = claimedKing;
      this.store.dispatch(new SetKingBalance(await this.kingService.getOwnedAmount()));
    } finally {
      this.isLoading = false;
    }
  }

  async onClickClaim() {
    await this.kingVaultService.claimVault();
    await this.loadData();
  }

}
