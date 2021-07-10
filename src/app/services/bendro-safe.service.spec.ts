import { TestBed } from '@angular/core/testing';

import { BendroSafeService } from './bendro-safe.service';

describe('BendroSafeService', () => {
  let service: BendroSafeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BendroSafeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
