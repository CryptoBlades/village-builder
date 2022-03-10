import { TestBed } from '@angular/core/testing';

import { SolidityService } from './solidity.service';

describe('SolidityService', () => {
  let service: SolidityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolidityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
