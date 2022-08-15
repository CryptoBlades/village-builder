import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Building} from "../../app.component";
import {getBuildingTypeName} from '../../common/common';
import {BuildingType} from "../../enums/building-type";
import {BuildingDialogComponent} from "../building-dialog/building-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-clickable-building',
  templateUrl: './clickable-building.component.html',
  styleUrls: ['./clickable-building.component.scss']
})
export class ClickableBuildingComponent implements OnInit {
  getBuildingTypeName = getBuildingTypeName;

  @Input() building!: Building;
  @Input() stakeCompleteTimestamp?: number;
  @Output() onLoadData: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  openBuildingDialog(buildingType: BuildingType) {
    const dialogRef = this.dialog.open(BuildingDialogComponent, {
      data: {buildingType},
      panelClass: 'building-dialog',
    });
    dialogRef.afterClosed().subscribe(async () => {
      this.onLoadData.emit();
    });
  }

  get isWall() {
    return this.building.type === BuildingType.WALL;
  }
}
