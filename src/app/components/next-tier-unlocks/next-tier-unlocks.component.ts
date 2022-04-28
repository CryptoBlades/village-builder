import {Component, Input, OnInit} from '@angular/core';
import {StakingTier} from "../../interfaces/staking-tier";

@Component({
  selector: 'app-next-tier-unlocks',
  templateUrl: './next-tier-unlocks.component.html',
  styleUrls: ['./next-tier-unlocks.component.scss']
})
export class NextTierUnlocksComponent implements OnInit {

  @Input() nextStakingTier!: StakingTier;

  constructor() {
  }

  ngOnInit(): void {
  }

}
