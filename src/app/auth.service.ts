import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { TokenResponse } from './models/token-response.model';
import { environment } from '../environments/environment';
import { Plugins } from '@capacitor/core';
import { tap, catchError } from 'rxjs/operators';
import { ErrorService } from './services/error.service';
const { Toast } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private error: ErrorService,
    private platform: Platform
  ) { }

  // An observable which can be subcribed to which allows you to detect when a data refresh is announced.
  private dataRefreshSource = new Subject();
  AuthUpdateAnnounced$ = this.dataRefreshSource.asObservable();

  /**
   * Trigger the service to send a refresh notification to all subscribers
   */
  announceAuthUpdate(eventType: 'LOGIN'|'LOGOUT') {
    this.dataRefreshSource.next(eventType);
    console.log('announceAuthUpdate called and sent!');
  }

  login(email: string, password: string, code?: number) {
    const session = { email, password, code, device: this.platform.platforms()?.join(':'), offline_access: true };

    return this.http.post<TokenResponse>(`${environment.baseUrlRoot}/auth`, { session }).pipe(
      tap(async result => {
        Toast.show({ text: 'Login Successful!' });
      }),
      catchError(this.error.handleError<any>('Login'))
    );
  }

  logout() {

  }

  checkAndRefreshAccessToken() {

  }

  storeAuthResponse() {

  }

  isAuthorized(): boolean {
    return false;
  }
}
