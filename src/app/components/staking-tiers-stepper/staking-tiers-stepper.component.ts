import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StakingTier} from "../../interfaces/staking-tier";
import {MatDialog} from "@angular/material/dialog";
import {SimpleConfirmationDialogComponent} from "../simple-confirmation-dialog/simple-confirmation-dialog.component";

@Component({
  selector: 'app-staking-tiers-stepper',
  templateUrl: './staking-tiers-stepper.component.html',
  styleUrls: ['./staking-tiers-stepper.component.scss']
})
export class StakingTiersStepperComponent implements OnInit {

  @Input() stakingTiers!: StakingTier[];
  @Input() currentStake!: number;
  @Input() unlockedTiers!: number;
  @Input() isPathFinished!: boolean;
  @Output() onUnstake: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  getDurationString(duration: number): string {
    const days = Math.floor(duration / (24 * 60 * 60));
    const hours = Math.floor((duration % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((duration % (60 * 60)) / 60);
    const seconds = Math.floor(duration % 60);

    return ((days ? `${days}d ` : '') + (hours ? ` ${hours}h` : '') + (minutes ? ` ${minutes}m` : '') + (seconds ? ` ${seconds}s` : '')).trim();
  }

  openUnstakeConfirmationDialog() {
    const dialogRef = this.dialog.open(SimpleConfirmationDialogComponent, {
      data: {
        dialogs: [
          {title: 'ConfirmationDialog.DoYouWantToUnstake', content: 'ConfirmationDialog.AreYouSureYouKnowWhatYouAreDoing'},
          {title: 'ConfirmationDialog.UnstakeIsPermanent', content: 'ConfirmationDialog.YouWontBeAbleToStakeAnymore'},
          {title: 'ConfirmationDialog.NoComingBackFromThis', content: 'ConfirmationDialog.YouWontBeAbleToComeBackFromThis'},
        ]
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.onUnstake.emit();
      }
      console.log('The dialog was closed', confirmed);
    });
  }

  unstakeWithoutConfirmation() {
    this.onUnstake.emit();
  }
}
