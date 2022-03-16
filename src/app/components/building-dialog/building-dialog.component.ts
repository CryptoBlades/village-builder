import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Building} from "../../app.component";
import {BuildingType, KingService} from "../../solidity/king.service";
import {BuildingRequirements, LandService} from "../../solidity/land.service";

@Component({
  selector: 'app-building-dialog',
  templateUrl: './building-dialog.component.html',
  styleUrls: ['./building-dialog.component.scss']
})
export class BuildingDialogComponent implements OnInit {

  building?: Building;
  timeLeft?: string;
  timeLeftCheckInterval?: any;
  canClaim = false;
  buildingRequirements?: BuildingRequirements;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { buildingType: BuildingType },
    private landService: LandService,
    private kingService: KingService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.buildingRequirements = await this.landService.getBuildingRequirements(this.data.buildingType);
    await this.loadBuilding();
    await this.getTimeLeft(+await this.kingService.getStakeCompleteTimestamp());
  }

  async loadBuilding(): Promise<void> {
    this.building = await this.landService.getBuilding(this.data.buildingType);
    this.canClaim = await this.kingService.canCompleteStake();
  }

  getBuildingTypeName(buildingType: BuildingType): string {
    return BuildingType[buildingType];
  }

  getTimeLeft(deadlineTimestamp: number) {
    if (!deadlineTimestamp) return;
    if (this.timeLeftCheckInterval) {
      clearInterval(this.timeLeftCheckInterval);
    }
    this.timeLeftCheckInterval = setInterval(async () => {
      const {total, days, hours, minutes, seconds} = this.getTimeRemaining(deadlineTimestamp.toString());
      this.timeLeft = `${days !== '00' ? `${days}d ` : ''} ${hours !== '00' ? `${hours}h ` : ''} ${minutes}m ${seconds}s`;
      console.log(this.timeLeft);
      if (total <= 1000 && this.timeLeftCheckInterval) {
        clearInterval(this.timeLeftCheckInterval);
        this.timeLeft = '';
        await this.loadBuilding();
      }
    }, 1000);
  }

  getTimeRemaining(end: string) {
    const total = new Date(+end * 1000).getTime() - new Date().getTime();
    let seconds: string | number = Math.floor((total / 1000) % 60);
    let minutes: string | number = Math.floor((total / 1000 / 60) % 60);
    let hours: string | number = Math.floor((total / (1000 * 60 * 60)) % 24);
    let days: string | number = Math.floor((total / (1000 * 60 * 60 * 24)));
    if (seconds < 10) {
      seconds = String(seconds).padStart(2, '0');
    }
    if (minutes < 10) {
      minutes = String(minutes).padStart(2, '0');
    }
    if (hours < 10) {
      hours = String(hours).padStart(2, '0');
    }
    if (days < 10) {
      days = String(days).padStart(2, '0');
    }

    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }

  async onClaim() {
    await this.kingService.claimStakeReward();
    console.log('Claimed');
    await this.loadBuilding();
  }

  async onStake() {
    if (!this.building) return;
    await this.kingService.stake(this.building?.type);
    console.log('Staked');
    await this.loadBuilding();
    await this.getTimeLeft(+await this.kingService.getStakeCompleteTimestamp());
  }

}
