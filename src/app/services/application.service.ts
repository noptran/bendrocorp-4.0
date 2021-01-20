import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { ErrorService } from './error.service';
import { Subject, Observable } from '../../../node_modules/rxjs';
import {
  CharacterApplication,
  CharacterApplicationComment,
  Character,
  CharacterApplicationInterview,
  NewCharacterApplication
} from '../models/character.model';
import { StatusMessage } from '../models/misc.model';
import { tap, catchError } from '../../../node_modules/rxjs/operators';
import { environment } from '../../environments/environment';
import { retryWithBackoff } from '../helpers/retryWithBackoff.helper';
// import { MessageService } from './message.service';
// import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData() {
    console.log('Requests service data refresh called!');
    this.dataRefreshSource.next();
  }

  createApplication(characterApplication: NewCharacterApplication): Observable<CharacterApplication> {
    return this.http.post<CharacterApplication>(`${environment.baseUrl}/apply`, characterApplication).pipe(
      retryWithBackoff(700, 2),
      tap(results => console.log('Advanced application status!')),
      catchError(this.errorService.handleError<any>('Create Application'))
    );
  }

  fetchApplication(): Observable<CharacterApplication> {
    return this.http.get<CharacterApplication>(`${environment.baseUrl}/apply`).pipe(
      retryWithBackoff(1000, 1),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Application', null, true))
    );
  }

  advanceApplication(character: Character): Observable<StatusMessage> {
    return this.http.get<StatusMessage>(`${environment.baseUrl}/apply/${character.id}/advance`).pipe(
      retryWithBackoff(1000, 3),
      tap(results => console.log('Advanced application status!')),
      catchError(this.errorService.handleError<any>('Advance Application'))
    );
  }

  rejectApplication(character: Character): Observable<StatusMessage> {
    return this.http.post<StatusMessage>(`${environment.baseUrl}/apply/reject`, { character }).pipe(
      retryWithBackoff(1000, 3),
      tap(results => console.log('Advanced application status!')),
      catchError(this.errorService.handleError<any>('Advance Application'))
    );
  }

  updateInterview(interview: CharacterApplicationInterview): Observable<CharacterApplicationInterview> {
    return this.http.patch<CharacterApplicationInterview>(`${environment.baseUrl}/apply`, { interview }).pipe(
      retryWithBackoff(1000, 3),
      tap(results => console.log('Updated application interview!')),
      catchError(this.errorService.handleError<any>('Update Interview'))
    );
  }

  addApplicationComment(application_comment: CharacterApplicationComment): Observable<CharacterApplicationComment> {
    return this.http.post<CharacterApplicationComment>(`${environment.baseUrl}/profile/comment`, { application_comment }).pipe(
      retryWithBackoff(1000, 3),
      tap(results => console.log('Created application comment!')),
      catchError(this.errorService.handleError<any>('Application Comment'))
    );
  }
}
