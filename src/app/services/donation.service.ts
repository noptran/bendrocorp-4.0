import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { DonationItem, Donation, StatusMessage } from '../models/misc.model';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

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
    console.log('Requests service data refresh called!');
    this.dataRefreshSource.next();
  }

  list(): Observable<DonationItem[]>
  {
    return this.http.get<DonationItem[]>(`${environment.baseUrl}/donation`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Fetch Donation Items', []))
    );
  }

  list_mine(): Observable<Donation[]>
  {
    return this.http.get<Donation[]>(`${environment.baseUrl}/donation/mine`).pipe(
      tap(result => console.log(`Fetched ${result.length} donation!`)),
      catchError(this.errorService.handleError('Fetch Donations', []))
    );
  }

  fetch(donationId: number)
  {
    return this.http.get<DonationItem>(`${environment.baseUrl}/donation/${donationId}`).pipe(
      tap(result => console.log(`Fetched ${result.id} donation items!`)),
      catchError(this.errorService.handleError('Fetch Donation Item'))
    );
  }

  create(donation_item: DonationItem): Observable<DonationItem>
  {
    return this.http.post<DonationItem>(`${environment.baseUrl}/donation/`, { donation_item }).pipe(
      tap(result => console.log(`Fetched ${result.id} donation items!`)),
      catchError(this.errorService.handleError('Fetch Donation Item'))
    );
  }

  update(donation_item: DonationItem): Observable<DonationItem>
  {
    return this.http.put<DonationItem>(`${environment.baseUrl}/donation/`, { donation_item }).pipe(
      tap(result => console.log(`Fetched ${result.id} donation items!`)),
      catchError(this.errorService.handleError('Fetch Donation Item'))
    );
  }

  archive(donation_item: DonationItem): Observable<DonationItem>
  {
    return this.http.delete<DonationItem>(`${environment.baseUrl}/donation/${donation_item.id}`).pipe(
      tap(result => console.log(`Fetched ${result.id} donation items!`)),
      catchError(this.errorService.handleError('Fetch Donation Item'))
    );
  }

  donate(donation: Donation): Observable<Donation>
  {
    return this.http.post<Donation>(`${environment.baseUrl}/donation/make`, { donation }).pipe(
      tap(result => console.log(`Fetched ${result.id} donation items!`)),
      catchError(this.errorService.handleError('Fetch Donation Item'))
    );
  }

  createSubscription(create_subscription: { paymentMethodId: string; }): Observable<StatusMessage>  {
    return this.http.post<StatusMessage>(`${environment.baseUrl}/subscription`, { create_subscription }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Fetch Donation Item'))
    );
  }

  endSubscription(): Observable<StatusMessage> {
    return this.http.delete<StatusMessage>(`${environment.baseUrl}/subscription`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('Fetch Donation Item'))
    );
  }
}
