import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IntelligenceCase, IntelligenceCaseComment } from '../models/intel.model';
import { StatusMessage } from '../models/misc.model';
import { User } from '../models/user.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class IntelService {

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their BenSec data
   */
  refreshData()
  {
    console.log('Intel service data refresh called!');
    this.dataRefreshSource.next();
  }

  listCases(): Observable<IntelligenceCase[]> {
    return this.http.get<IntelligenceCase[]>(`${environment.baseUrl}/intel`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Fetch Cases', []))
    );
  }

  fetchCase(intelligence_case_id: string): Observable<IntelligenceCase> {
    return this.http.get<IntelligenceCase>(`${environment.baseUrl}/intel/${intelligence_case_id}`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Fetch Case', null))
    );
  }

  createCase(intelligenceCase: IntelligenceCase): Observable<IntelligenceCase> {
    const intelligence_case = intelligenceCase;
    return this.http.post<IntelligenceCase>(`${environment.baseUrl}/intel`, { intelligence_case }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Create Case', null))
    );
  }

  updateCase(intelligenceCase: IntelligenceCase): Observable<IntelligenceCase> {
    const intelligence_case = intelligenceCase;
    return this.http.put<IntelligenceCase>(`${environment.baseUrl}/intel/${intelligence_case.id}`, { intelligence_case }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Update Case', null))
    );
  }

  archiveCase(intelligence_case_id: string): Observable<StatusMessage> {
    return this.http.get<StatusMessage>(`${environment.baseUrl}/intel/${intelligence_case_id}`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Archive Case'))
    );
  }

  addComment(comment: IntelligenceCaseComment, case_id: string): Observable<IntelligenceCaseComment> {
    const intelligence_case_comment = comment;
    return this.http.post<IntelligenceCase>(`${environment.baseUrl}/intel/${case_id}/comment`, { intelligence_case_comment }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Create Case Comment'))
    );
  }

  deleteComment(comment: IntelligenceCaseComment, case_id: string): Observable<IntelligenceCaseComment> {
    return this.http.get<StatusMessage>(`${environment.baseUrl}/intel/${case_id}/comment/${comment.id}`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Archive Case Comment'))
    );
  }

  /**
   * Fetch list of available security officers
   * @returns User[]
   */
  fetchAvailableOfficers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.baseUrl}/intel/officers`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Fetch Available Officers', []))
    );
  }
}
