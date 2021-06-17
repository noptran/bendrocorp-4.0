import { TestBed } from '@angular/core/testing';

import { IncidentServiceService } from './incident-service.service';

describe('IncidentServiceService', () => {
  let service: IncidentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
