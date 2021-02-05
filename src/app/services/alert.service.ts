import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BendroAlert } from '../models/alert.model';
import { StatusMessage } from '../models/misc.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log('Alerts service data refresh called!');
    this.dataRefreshSource.next();
  }

  list(): Observable<BendroAlert[]> {
    return this.http.get<BendroAlert[]>(`${environment.baseUrl}/alert`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('List Alerts', []))
    );
  }

  create(alert: BendroAlert): Observable<BendroAlert> {
    return this.http.post<BendroAlert>(`${environment.baseUrl}/alert`, { alert }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Create Alert'))
    );
  }

  update(alert: BendroAlert): Observable<BendroAlert> {
    return this.http.put<BendroAlert>(`${environment.baseUrl}/alert`, { alert }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Update Alert'))
    );
  }

  archive(alert: BendroAlert): Observable<StatusMessage> {
    return this.http.delete<StatusMessage>(`${environment.baseUrl}/alert/${alert.id}`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Archive Alert'))
    );
  }
}
