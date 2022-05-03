import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Building} from "../../app.component";
import {LandService} from "../../solidity/land.service";
import {BuildingType} from "../../enums/building-type";

@Component({
  selector: 'app-building-dialog',
  templateUrl: './building-dialog.component.html',
  styleUrls: ['./building-dialog.component.scss']
})
export class BuildingDialogComponent implements OnInit {
  building?: Building;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { buildingType: BuildingType },
    private landService: LandService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
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

}
