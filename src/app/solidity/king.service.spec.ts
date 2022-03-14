import { TestBed } from '@angular/core/testing';

import { KingService } from './king.service';

describe('KingService', () => {
  let service: KingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
