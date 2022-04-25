import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponStakingComponent } from './weapon-staking.component';

describe('WeaponStakingComponent', () => {
  let component: WeaponStakingComponent;
  let fixture: ComponentFixture<WeaponStakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeaponStakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponStakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
