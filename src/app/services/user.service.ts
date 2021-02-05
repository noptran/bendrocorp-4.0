// /user/approvals-count

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { StatusMessage } from '../models/misc.model';
import { environment } from '../../environments/environment';
import { retryWithBackoff } from '../helpers/retryWithBackoff.helper';
import { PushTokenReg } from '../models/push-token-reg.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private errorService: ErrorService) { }

  private approvalsDataRefreshSource = new Subject();
  approvalsDataRefreshAnnounced$ = this.approvalsDataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their approvals data
   */
  refreshData() {
    console.log('Approvals data refresh called!');
    this.approvalsDataRefreshSource.next();
  }

  fetchPendingApprovalsCount(): Observable<number> {
    return this.http.get<number>(`${environment.baseUrl}/user/approvals-count`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`You have ${result} pending approvals!`)),
      catchError(this.errorService.handleError<any>('Fetch Job Board'))
    );
  }

  fetchTotalApprovalCount(): Observable<number> {
    return this.http.get<number>(`${environment.baseUrl}/user/approvals-count-total`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`You have ${result} total approvals!`)),
      catchError(this.errorService.handleError<any>('Fetch Job Board'))
    );
  }

  registerForPushNotifications(push_token: PushTokenReg) {
    return this.http.post<StatusMessage>(`${environment.baseUrl}/user/push-token`, { push_token }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Added push notification!`)),
      catchError(this.errorService.handleError<any>('Push Notification Registration'))
    );
  }
}
