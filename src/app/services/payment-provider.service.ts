import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentProviderService {
  env = environment.production;
  stripe = (this.env) ? Stripe('pk_live_yvICcI6VrsZng3C4a4vpJtNy') : Stripe('pk_test_qdt2boJeLEppzUk6MTQKpbPZ');
  elements = this.stripe.elements();
  constructor() { }
}
