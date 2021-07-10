import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IncidentReport, IncidentReportComment } from '../models/intel.model';
import { StatusMessage } from '../models/misc.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

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
    console.log('Incident reports service data refresh called!');
    this.dataRefreshSource.next();
  }

  listReports(): Observable<IncidentReport[]> {
    return this.http.get<IncidentReport[]>(`${environment.baseUrl}/incident`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Fetch Incident Reports', []))
    );
  }

  listMyReports(): Observable<IncidentReport[]> {
    return this.http.get<IncidentReport[]>(`${environment.baseUrl}/incident/my`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Fetch Incident Reports', []))
    );
  }

  fetchReport(incident_report_id: string): Observable<IncidentReport> {
    return this.http.get<IncidentReport>(`${environment.baseUrl}/incident/${incident_report_id}`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Fetch Incident Report', null))
    );
  }

  createReport(incidentReport: IncidentReport): Observable<IncidentReport> {
    const incident_report = incidentReport;
    return this.http.post<IncidentReport>(`${environment.baseUrl}/incident`, { incident_report }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Create Incident Report', null))
    );
  }

  updateReport(incidentReport: IncidentReport): Observable<IncidentReport> {
    const incident_report = incidentReport;
    return this.http.put<IncidentReport>(`${environment.baseUrl}/incident/${incidentReport.id}`, { incident_report }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Update Incident Report', null))
    );
  }

  archiveReport(incident_report_id: string): Observable<StatusMessage> {
    return this.http.get<StatusMessage>(`${environment.baseUrl}/incident/${incident_report_id}`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Archive Incident Report'))
    );
  }

  addComment(comment: IncidentReportComment, report_id: string): Observable<IncidentReportComment> {
    const incident_report_comment = comment;
    return this.http.post<IncidentReport>(`${environment.baseUrl}/incident/${report_id}/comment`, { incident_report_comment }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Create Case Comment'))
    );
  }

  deleteComment(comment: IncidentReportComment, report_id: string): Observable<StatusMessage> {
    return this.http.get<StatusMessage>(`${environment.baseUrl}/incident/${report_id}/comment/${comment.id}`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Archive Case Comment'))
    );
  }

  approveReport(incident_report_id: string): Observable<StatusMessage> {
    return this.http.get<StatusMessage>(`${environment.baseUrl}/incident/${incident_report_id}/approve`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Fetch Incident Report', null))
    );
  }

  declineReport(incident_report_id: string): Observable<StatusMessage> {
    return this.http.get<StatusMessage>(`${environment.baseUrl}/incident/${incident_report_id}/decline`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Fetch Incident Report', null))
    );
  }
}
