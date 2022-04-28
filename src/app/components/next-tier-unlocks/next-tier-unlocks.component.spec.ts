import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextTierUnlocksComponent } from './next-tier-unlocks.component';

describe('NextTierUnlocksComponent', () => {
  let component: NextTierUnlocksComponent;
  let fixture: ComponentFixture<NextTierUnlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextTierUnlocksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextTierUnlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
