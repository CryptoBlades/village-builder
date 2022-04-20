import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakingTiersStepperComponent } from './staking-tiers-stepper.component';

describe('StakingTiersStepperComponent', () => {
  let component: StakingTiersStepperComponent;
  let fixture: ComponentFixture<StakingTiersStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakingTiersStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakingTiersStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
