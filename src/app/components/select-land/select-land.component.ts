import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Land} from "../../interfaces/land";
import {LandService} from "../../solidity/land.service";

@Component({
  selector: 'app-select-land',
  templateUrl: './select-land.component.html',
  styleUrls: ['./select-land.component.scss']
})
export class SelectLandComponent implements OnInit {
  @Input() land!: Land;

  @Output() selectedLand: EventEmitter<any> = new EventEmitter<number>();


  constructor(
    private landService: LandService,
  ) {
  }

  ngOnInit(): void {
  }

  async onClickSelect() {
    await this.landService.stakeLand(this.land.id);
    this.selectedLand.emit(this.land);
  }

}
