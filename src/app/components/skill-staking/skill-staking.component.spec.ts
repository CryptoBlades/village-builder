import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillStakingComponent } from './skill-staking.component';

describe('SkillStakingComponent', () => {
  let component: SkillStakingComponent;
  let fixture: ComponentFixture<SkillStakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillStakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillStakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
