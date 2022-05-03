import { TestBed } from '@angular/core/testing';

import { KingVaultService } from './king-vault.service';

describe('KingVaultService', () => {
  let service: KingVaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KingVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
