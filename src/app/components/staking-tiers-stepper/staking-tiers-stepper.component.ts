import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StakingTier} from "../../interfaces/staking-tier";

@Component({
  selector: 'app-staking-tiers-stepper',
  templateUrl: './staking-tiers-stepper.component.html',
  styleUrls: ['./staking-tiers-stepper.component.scss']
})
export class StakingTiersStepperComponent implements OnInit {

  @Input() stakingTiers!: StakingTier[];
  @Input() currentStake!: number;
  @Input() unlockedTiers!: number;
  @Output() onUnstake: EventEmitter<any> = new EventEmitter();

  constructor() {
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
}
