import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  handleError<T>(arg0: string): (err: any, caught: import("rxjs").Observable<import("../models/token-response.model").TokenResponse>) => import("rxjs").ObservableInput<any> {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
