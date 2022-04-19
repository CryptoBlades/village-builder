import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KingStakingComponent } from './king-staking.component';

describe('KingStakingComponent', () => {
  let component: KingStakingComponent;
  let fixture: ComponentFixture<KingStakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KingStakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KingStakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
