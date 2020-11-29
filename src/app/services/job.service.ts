import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { Job, Division } from '../models/character.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

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
    console.log("Jobs service data refresh called!");
    this.dataRefreshSource.next();
  }

  list(): Observable<Job[]>
  {
    return this.http.get<Job[]>(`${environment.baseUrl}/job`).pipe(
      tap(results => console.log(`Fetched ${results.length} jobs`)),
      catchError(this.errorService.handleError('Fetch Jobs', []))
    )
  }

  listDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(`${environment.baseUrl}/division`).pipe(
      tap(results => console.log(`Fetched ${results.length} divisions`)),
      catchError(this.errorService.handleError('Fetch Jobs', []))
    );
  }

  create(job: Job): Observable<Job> {
    return this.http.post<Job>(`${environment.baseUrl}/job`, { job }).pipe(
      tap(results => console.log(`Created job with id # ${results.id}`)),
      catchError(this.errorService.handleError('Fetch Jobs'))
    )
  }

  update(job: Job): Observable<Job> {
    return this.http.put<Job>(`${environment.baseUrl}/job`, { job }).pipe(
      tap(results => console.log(`Created job with id # ${results.id}`)),
      catchError(this.errorService.handleError('Fetch Jobs'))
    )
  }
}
