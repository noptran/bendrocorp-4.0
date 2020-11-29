import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { MenuItem } from './models/misc.model';
import { ErrorService } from './services/error.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  list(): Promise<MenuItem[]>
  {
    return new Promise (async (success, error) => {
      this.http.get<MenuItem[]>(`${environment.baseUrl}/menu`).pipe(
        tap(results => console.log('Fetched the menu')),
        catchError(this.errorService.handleError('Fetch Menu', []))
      ).subscribe((result) => {
        return success(result);
      });
    });
  }
}
