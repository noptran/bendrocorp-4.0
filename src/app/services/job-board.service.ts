import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { Subject, Observable } from 'rxjs';
import { JobBoardMission, JobBoardMissionCompletionCriteria, JobBoardMissionCompletionRequest } from '../models/job-board.model';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { retryWithBackoff } from '../helpers/retryWithBackoff.helper';

@Injectable({
  providedIn: 'root'
})
export class JobBoardService {

  constructor(private http: HttpClient, private errorService: ErrorService,) { }

  private passedData = {} as JobBoardMission;
  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log("Job board service data refresh called!");
    this.dataRefreshSource.next();
  }

  /**
   * Used to pass events between event related components
   * @param event An event you want to pass
   */
  setPassData(event: JobBoardMission) {
    this.passedData = event;
  }

  /**
   * Fetch and remove the event object held in the passed data object
   */
  fetchAndClearPassedData() {
    const ret = this.passedData;
    this.passedData = {} as JobBoardMission;
    return ret;
  }

  list(): Observable<JobBoardMission[]>
  {
    return this.http.get<JobBoardMission[]>(`${environment.baseUrl}/job-board`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Fetched ${result.length} missions!`)),
      catchError(this.errorService.handleError('Fetch Job Board', []))
    );
  }

  fetch(missionId: number): Observable<JobBoardMission>
  {
    return this.http.get<JobBoardMission>(`${environment.baseUrl}/job-board/${missionId}`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Fetched mission # ${result.id}!`)),
      catchError(this.errorService.handleError<any>('Fetch Job Board'))
    );
  }

  list_criteria(): Observable<JobBoardMissionCompletionCriteria[]>
  {
    return this.http.get<JobBoardMissionCompletionCriteria[]>(`${environment.baseUrl}/job-board/types`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Fetched ${result.length} criterium!`)),
      catchError(this.errorService.handleError('Fetch Job Board Criteria', []))
    );
  }

  create(job_board_mission: JobBoardMission): Observable<JobBoardMission>
  {
    return this.http.post<JobBoardMission>(`${environment.baseUrl}/job-board`, { job_board_mission }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Created mission with id# ${result.id}!`)),
      catchError(this.errorService.handleError<any>('Fetch Job Board'))
    );
  }

  update(job_board_mission: JobBoardMission): Observable<JobBoardMission>
  {
    return this.http.patch<JobBoardMission>(`${environment.baseUrl}/job-board`, { job_board_mission }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Updated mission with id# ${result.id}!`)),
      catchError(this.errorService.handleError<any>('Fetch Job Board'))
    );
  }

  delete(job_board_mission: JobBoardMission): Observable<JobBoardMission>
  {
    return this.http.delete<JobBoardMission>(`${environment.baseUrl}/job-board/${job_board_mission.id}`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Archived mission with id# ${result.id}!`)),
      catchError(this.errorService.handleError<any>('Fetch Job Board'))
    );
  }

  accept(job_board_mission_id: number): Observable<JobBoardMission>
  {
    return this.http.post<JobBoardMission>(`${environment.baseUrl}/job-board/accept`, { job_board_mission_id }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Accepted mission with id# ${job_board_mission_id}!`)),
      catchError(this.errorService.handleError<any>('Accept Mission'))
    );
  }

  abandon(job_board_mission_id: number): Observable<JobBoardMission>
  {
    return this.http.post<JobBoardMission>(`${environment.baseUrl}/job-board/abandon`, { job_board_mission_id }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Accepted mission with id# ${job_board_mission_id}!`)),
      catchError(this.errorService.handleError<any>('Accept Mission'))
    );
  }

  complete(completion_request: JobBoardMissionCompletionRequest)
  {
    return this.http.post<JobBoardMission>(`${environment.baseUrl}/job-board/complete`, { completion_request }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Submitted completion request for mission with id# ${completion_request.mission_id}!`)),
      catchError(this.errorService.handleError<any>('Complete Mission'))
    );
  }
}
