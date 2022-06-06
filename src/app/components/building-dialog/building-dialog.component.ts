import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Building} from "../../app.component";
import {LandService} from "../../solidity/land.service";
import {BuildingType} from "../../enums/building-type";
import {getBuildingTypeName} from "../../common/common";

@Component({
  selector: 'app-building-dialog',
  templateUrl: './building-dialog.component.html',
  styleUrls: ['./building-dialog.component.scss']
})
export class BuildingDialogComponent implements OnInit {
  getBuildingTypeName = getBuildingTypeName;
  building?: Building;
  isLoading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { buildingType: BuildingType },
    private landService: LandService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;
      await this.loadData();
    } finally {
      this.isLoading = false;
    }
  }

  async loadData(): Promise<void> {
    this.building = await this.landService.getBuilding(this.data.buildingType);
  }

  get isBarracks() {
    return this.building?.type === BuildingType.BARRACKS;
  }

  get isResourcesGenerator() {
    return this.building?.type === BuildingType.CLAY_PIT ||
      this.building?.type === BuildingType.FOREST_CAMP ||
      this.building?.type === BuildingType.STONE_MINE;
  }

  get isSmithy() {
    return this.building?.type === BuildingType.SMITHY;
  }

  getTabTooltip() {
    if (this.building && this.building.level === 0) {
      return `You need to build ${getBuildingTypeName(this.building.type)} first`
    } else return '';
  }

}
