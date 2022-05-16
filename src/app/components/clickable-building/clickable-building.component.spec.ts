import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickableBuildingComponent } from './clickable-building.component';

describe('ClickableBuildingComponent', () => {
  let component: ClickableBuildingComponent;
  let fixture: ComponentFixture<ClickableBuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClickableBuildingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickableBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
