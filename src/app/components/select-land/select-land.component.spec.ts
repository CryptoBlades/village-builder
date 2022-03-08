import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLandComponent } from './select-land.component';

describe('SelectLandComponent', () => {
  let component: SelectLandComponent;
  let fixture: ComponentFixture<SelectLandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectLandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
