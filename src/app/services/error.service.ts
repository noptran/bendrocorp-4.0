import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Observable, of } from 'rxjs';
const { Toast } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  message: string;

  constructor(
    private platform: Platform,
    private router: Router
  ) { }

  handleError<T>(operation = 'operation', result?: T, skipMessage?: boolean) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure

      console.error(error); // log to console instead
      // this.msg.type = 2; // error
      if (error instanceof HttpErrorResponse) {
        // if we get a 401 that means that we need to be logged in
        // forward to the login page
        if (error.status === 401) {
          // localStorage.removeItem('userObject');
        }

        if (error.status === 504) {
          this.router.navigateByUrl('/offline');
        }

        if (error.statusText !== 'Unknown Error') {
          if (error.error && error.error.message) {
            this.message = `${operation}: ${error.message}`;
            if (!skipMessage) {
              Toast.show({ text: this.message });
            }
          } else {
            this.message = `${operation}: ${error.message}`;
            if (!skipMessage) {
              Toast.show({ text: this.message });
            }
          }

          // this.createLog({ severity: 'ERROR', module: operation, message: error.message } as LogItem) 
          if (!skipMessage) {
            Toast.show({ text: this.message });
          }
        } else {
          // TODO: (to test) Needs to make sure that this works properly on mobile
          this.router.navigateByUrl('/offline');
          const keyword: string = (this.platform.is('mobile')) ? 'restart' : 'refresh';
          Toast.show({ text: `An internet connection error has occured. If the app does ${keyword} you may need to ${keyword} it.` });
        }
      } else {
        this.message = `${operation} failed: ${error.message}`;
      }

      console.log(this.message);

      return of(error as T);
    };
  }
}
