import { TestBed, inject } from '@angular/core/testing';

import { PaymentProviderService } from './payment-provider.service';

describe('PaymentProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentProviderService]
    });
  });

  it('should be created', inject([PaymentProviderService], (service: PaymentProviderService) => {
    expect(service).toBeTruthy();
  }));
});
