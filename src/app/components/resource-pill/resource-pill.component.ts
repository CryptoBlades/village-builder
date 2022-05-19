import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-resource-pill',
  templateUrl: './resource-pill.component.html',
  styleUrls: ['./resource-pill.component.scss']
})
export class ResourcePillComponent implements OnInit {

  @Input() balance?: number;
  @Input() image!: string;
  @Input() tooltip!: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
