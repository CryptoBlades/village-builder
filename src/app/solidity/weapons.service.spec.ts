import { TestBed } from '@angular/core/testing';

import { WeaponsService } from './weapons.service';

describe('WeaponsService', () => {
  let service: WeaponsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeaponsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
