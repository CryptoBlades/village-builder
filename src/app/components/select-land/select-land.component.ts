import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Land} from "../../interfaces/land";

@Component({
  selector: 'app-select-land',
  templateUrl: './select-land.component.html',
  styleUrls: ['./select-land.component.scss']
})
export class SelectLandComponent implements OnInit {
  @Input() land!: Land;

  @Output('selectedLand') selectedLand: EventEmitter<any> = new EventEmitter<number>();


  constructor() {
  }

  ngOnInit(): void {
  }

  onClickSelect() {
    this.selectedLand.next(this.land);
  }

}
