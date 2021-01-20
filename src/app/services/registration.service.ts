import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StatusMessage } from '../models/misc.model';
import { SignUp } from '../models/user.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(
    private http: HttpClient,
    private error: ErrorService
  ) { }

  signup(signup: SignUp): Observable<StatusMessage> {
    return this.http.post<StatusMessage>(`${environment.baseUrl}/signup`, { signup }).pipe(
      tap(result => console.log('New sign up created!')),
      catchError(this.error.handleError<any>('Sign Up', null, true))
    );
  }

  requestPasswordReset(email: string): Observable<StatusMessage> {
    const user = { email };
    return this.http.post<StatusMessage>(`${environment.baseUrl}/account/forgot-password`, { user }).pipe(
      tap(result => console.log('Requested password reset!')),
      catchError(this.error.handleError<any>('Request Password Reset'))
    );
  }

  doPasswordReset(password: string, password_confirmation: string, password_reset_token: string): Observable<StatusMessage> {
    const user = { password, password_confirmation, password_reset_token };
    return this.http.post<StatusMessage>(`${environment.baseUrl}/account/reset-password`, { user }).pipe(
      tap(result => console.log('Password reset!')),
      catchError(this.error.handleError<any>('Password Reset', null, true))
    );
  }
}
