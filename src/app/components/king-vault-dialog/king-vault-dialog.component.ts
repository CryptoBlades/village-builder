import {Component, OnInit} from '@angular/core';
import {KingService} from "../../solidity/king.service";
import {Store} from "@ngxs/store";
import {SkillService} from "../../solidity/skill.service";
import {SetKingBalance} from "../../state/wallet/wallet.actions";

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
    private skillService: SkillService,
    private store: Store,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData() {
    const [totalKingInVault, claimableKing] = await Promise.all([
      this.skillService.getTotalKingInVault(),
      this.skillService.getClaimableKing(),
    ]);
    this.totalKingInVault = totalKingInVault;
    this.claimableKing = claimableKing;
    this.store.dispatch(new SetKingBalance(await this.kingService.getOwnedAmount()));
  }

  async onClickClaim() {
    await this.skillService.claimKing();
    await this.loadData();
  }

}
