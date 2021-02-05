import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StatusMessage } from '../models/misc.model';
import { Report, ReportTemplate, ReportField, ReportFieldValue, ReportHandler, ReportRoute } from '../models/report.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  private reportsRefreshSource = new Subject();
  reportsRefreshAnnounced$ = this.reportsRefreshSource.asObservable();

  private templatesRefreshSource = new Subject();
  templatesRefreshAnnounced$ = this.templatesRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshReportsData()
  {
    console.log('Reports service reports data refresh called!');
    this.reportsRefreshSource.next();
  }
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshTemplatesData()
  {
    console.log('Reports service templates data refresh called!');
    this.templatesRefreshSource.next();
  }

  listReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${environment.baseUrl}/reports`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Reports'))
    );
  }

  createReport(report: Report): Observable<Report> {
    return this.http.post<Report>(`${environment.baseUrl}/reports`, { report }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Create Report'))
    );
  }

  updateReport(report: Report): Observable<Report> {
    return this.http.put<Report>(`${environment.baseUrl}/reports`, { report }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Report'))
    );
  }

  archiveReport(report: Report): Observable<StatusMessage> {
    return this.http.delete<StatusMessage>(`${environment.baseUrl}/reports/${report.id}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Archive Report'))
    );
  }

  listTemplates(): Observable<ReportTemplate[]> {
    return this.http.get<ReportTemplate[]>(`${environment.baseUrl}/reports/templates`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Templates'))
    );
  }

  createTemplate(report_template: ReportTemplate): Observable<ReportTemplate> {
    return this.http.post<ReportTemplate>(`${environment.baseUrl}/reports/templates`, { report_template }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Create Template'))
    );
  }

  updateTemplate(report_template: ReportTemplate): Observable<ReportTemplate> {
    return this.http.put<ReportTemplate>(`${environment.baseUrl}/reports/templates`, { report_template }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Template'))
    );
  }

  archiveTemplate(report_template: ReportTemplate): Observable<StatusMessage> {
    return this.http.delete<StatusMessage>(`${environment.baseUrl}/reports/templates/${report_template.id}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Archive Templates'))
    );
  }

  createTemplateField(report_field: ReportField): Observable<ReportField> {
    return this.http.post<ReportField>(`${environment.baseUrl}/reports/fields`, { report_field }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Create Field'))
    );
  }

  updateTemplateField(report_field: ReportField): Observable<ReportField> {
    return this.http.put<ReportField>(`${environment.baseUrl}/reports/fields`, { report_field }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Field'))
    );
  }

  archiveTemplateField(report_field: ReportField): Observable<StatusMessage> {
    return this.http.delete<ReportField>(`${environment.baseUrl}/reports/fields/${report_field.id}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Archive Field'))
    );
  }

  updateFieldValue(field_value: ReportFieldValue): Observable<ReportFieldValue> {
    return this.http.put<ReportFieldValue>(`${environment.baseUrl}/reports/values`, { field_value }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Field Value'))
    );
  }

  listReportHandlers(): Observable<ReportHandler[]> {
    return this.http.get<ReportHandler[]>(`${environment.baseUrl}/reports/templates/handlers`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Report Handlers'))
    );
  }

  listReportRoutes(): Observable<ReportRoute[]> {
    return this.http.get<ReportRoute[]>(`${environment.baseUrl}/reports/routes`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Report Routes'))
    );
  }
}
