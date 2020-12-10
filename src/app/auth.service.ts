import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { TokenResponse } from './models/token-response.model';
import { environment } from '../environments/environment';
import { Plugins } from '@capacitor/core';
import { tap, catchError } from 'rxjs/operators';
import { ErrorService } from './services/error.service';
import { StoredToken } from './models/stored-token.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { UserSessionResponse } from './models/user.model';
import { Router } from '@angular/router';
const { Toast, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private error: ErrorService,
    private platform: Platform,
    private router: Router
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

  login(email: string, password: string, code?: number): Observable<TokenResponse> {
    const session = { email, password, code, device: this.platform.platforms()?.join(':'), offline_access: true };

    return this.http.post<TokenResponse>(`${environment.baseUrlRoot}/auth`, { session }).pipe(
      tap(async result => {
        Toast.show({ text: 'Login Successful!' });
      }),
      catchError(this.error.handleError<any>('Login', null, true))
    );
  }

  async logout() {
    await Storage.remove({ key: 'userSession' });
  }

  refreshLogin(refreshToken: TokenResponse): Observable<TokenResponse> {
    const grant_type = 'refresh_token';
    const refresh_token = refreshToken.refresh_token;
    const session = { grant_type, refresh_token };

    return this.http.post<TokenResponse>(`${environment.baseUrlRoot}/auth`, { session }).pipe(
      tap(result => {
        console.log('Login refreshed!');
      }),
      catchError(this.error.handleError<any>('Login', null, true))
    );
  }

  async checkAndRefreshAccessToken(override: boolean = false): Promise<string|HttpErrorResponse> {
    return new Promise (async (results, error) => {
      const authResponse = await this.getAuthResponse();

      // initial verification, do we have a stored token set?
      if (authResponse) {
        // so we have a token set available
        // is the token set expired?
        if (await this.isAuthorized() || override) {
          // return the valid, not expired access token
          console.log('checkAndRefreshAccessToken(): New token did not have to be fetched');
          results(authResponse.access_token);
        } else {
          // try to retrieve a new token if the current token is expired
          this.refreshLogin(authResponse).subscribe((response) => {
            if (!(response instanceof HttpErrorResponse)) {
              console.log('checkAndRefreshAccessToken(): New token retrieved');
              this.storeAuthResponse(response);
              this.announceAuthUpdate('LOGIN');
              results(response.access_token);
            } else {
              response.headers.keys();
              error(response);
              if (response.status === 401) {
                this.redirectToLogin();
              }
            }
          });
        }
      } else {
        this.redirectToLogin();
        // error('Auth response is not present!');
        // if null attempt to retrieve an auth token
        // this.refreshAccessToken().subscribe((response) => {
        //   if (!(response instanceof HttpErrorResponse)) {
        //     const authResponseTwo = response.response;
        //     this.storeAuthResponse(authResponseTwo);
        //     this.announceAuthUpdate('LOGIN');
        //     results(authResponseTwo.access_token);
        //   } else {
        //     response.headers.keys();
        //     error(response);
        //     if (response.headers.get('X-UTPM-SESSION-ERROR')) {
        //       this.redirectToLogin();
        //     }
        //   }
        // });
      }
    });
  }

  async storeAuthResponse(token: TokenResponse) {
    await Storage.set({ key: 'userSession', value: JSON.stringify(token) });
  }

  async getAuthResponse(): Promise<TokenResponse> {
    const result = await Storage.get({ key: 'userSession' });
    return JSON.parse(result.value) as TokenResponse;
  }

  async retrieveUserSession(): Promise<UserSessionResponse> {
    const session = await this.getAuthResponse();
    if (session) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(session.access_token);

      return {
        id: decodedToken.sub,
        roles: decodedToken.roles,
        first_name: decodedToken.given_name,
        last_name: decodedToken.family_name,
        avatar: decodedToken.avatar,
        expires: decodedToken.exp,
        tfa_enabled: decodedToken.tfa_enabled,
        character_id: decodedToken.character_id,
        job_title: decodedToken.job_title
      } as UserSessionResponse;
    }
  }

  async hasClaim(roleId: number): Promise<boolean> {
    if (this.isAuthorized()) {
      if ((await this.retrieveUserSession() as UserSessionResponse).roles.length > 0) {
        const roles = (await this.retrieveUserSession() as UserSessionResponse).roles;
        const claim = roles.find(x => x === roleId);
        if (claim === roleId) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  async isAuthorized(): Promise<boolean> {
    const auth = await this.retrieveUserSession();
    if (auth) {
      const expires = await this.getExpiration();
      const expireResults = moment().isBefore(expires);
      return expireResults;
    }

    return false;
  }

  async getExpiration() {
    const userObject = await this.retrieveUserSession();
    return moment.unix(userObject.expires);
  }

  preservePath() {
    if (!window.location.pathname.includes('auth')) {
      localStorage.setItem('bendro:redirect:path', window.location.pathname);
    }
  }

  redirectToLogin() {
    this.preservePath();
    // window.location.href = uri;
    this.router.navigateByUrl('/auth');
  }
}
