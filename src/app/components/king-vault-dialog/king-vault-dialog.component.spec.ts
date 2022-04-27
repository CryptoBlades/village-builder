import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KingVaultDialogComponent } from './king-vault-dialog.component';

describe('KingVaultDialogComponent', () => {
  let component: KingVaultDialogComponent;
  let fixture: ComponentFixture<KingVaultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KingVaultDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KingVaultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
