import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { retryWithBackoff } from '../helpers/retryWithBackoff.helper';
import { FactionAffiliation, StatusMessage } from '../models/misc.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class FactionService {

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log('Faction admin service data refresh called!');
    this.dataRefreshSource.next();
  }

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
  ) { }

  listFactions(): Observable<FactionAffiliation[]> {
    return this.http.get<FactionAffiliation[]>(`${environment.baseUrl}/factions`).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Factions'))
    );
  }

  createFaction(faction: FactionAffiliation): Observable<FactionAffiliation> {
    return this.http.post<FactionAffiliation>(`${environment.baseUrl}/factions`, { faction }).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Create Faction'))
    );
  }

  updateFaction(faction: FactionAffiliation): Observable<FactionAffiliation> {
    return this.http.put<FactionAffiliation>(`${environment.baseUrl}/factions`, { faction }).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Faction'))
    );
  }

  archiveFaction(faction: FactionAffiliation): Observable<StatusMessage> {
    return this.http.delete<StatusMessage>(`${environment.baseUrl}/factions/${faction.id}`).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Archive Faction'))
    );
  }
}
