import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { BendroSafeSearchResult } from '../models/safe-search-result';

@Injectable({
  providedIn: 'root'
})
export class BendroSafeService {
  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  search(rsi_handle: string): Observable<BendroSafeSearchResult>
  {
    return this.http.post<BendroSafeSearchResult>(`${environment.baseUrl}/safe/search`, { rsi_handle }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError('SAFESearch'))
    );
  }
}
