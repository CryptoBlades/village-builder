import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePillComponent } from './resource-pill.component';

describe('ResourcePillComponent', () => {
  let component: ResourcePillComponent;
  let fixture: ComponentFixture<ResourcePillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcePillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
