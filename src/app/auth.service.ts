import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // An observable which can be subcribed to which allows you to detect when a data refresh is announced.
  private dataRefreshSource = new Subject();
  AuthUpdateAnnounced$ = this.dataRefreshSource.asObservable();

  /**
   * Trigger the service to send a refresh notification to all subscribers
   */
  announceAuthUpdate(eventType: 'LOGIN'|'LOGOUT')
  {
    this.dataRefreshSource.next(eventType);
    console.log('announceAuthUpdate called and sent!');
  }

  login()
  {

  }

  logout()
  {
    
  }

  checkAndRefreshAccessToken()
  {

  }

  isAuthorized(): boolean {
    return false;
  }
}
