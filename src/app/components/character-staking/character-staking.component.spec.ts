import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterStakingComponent } from './character-staking.component';

describe('CharacterStakingComponent', () => {
  let component: CharacterStakingComponent;
  let fixture: ComponentFixture<CharacterStakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterStakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterStakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
