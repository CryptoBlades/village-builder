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
}
