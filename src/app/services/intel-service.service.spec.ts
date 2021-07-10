import { TestBed } from '@angular/core/testing';

import { IntelServiceService } from './intel-service.service';

describe('IntelServiceService', () => {
  let service: IntelServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntelServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
