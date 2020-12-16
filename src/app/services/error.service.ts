import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    private platform: Platform
  ) { }

  handleError<T>(operation = 'operation', result?: T, skipMessage?: boolean) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure

      console.error(error); // log to console instead
      // this.msg.type = 2; // error
      if (error instanceof HttpErrorResponse) {
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

          // if we get a 401 that means that we need to be logged in
          // forward to the login page
          if (error.status === 401) {
            // TODO: Silently handle the relogin rather than forcing navigation back to the login screen
            localStorage.removeItem('userObject');
            // localStorage.setItem("authRedirect", error.url)
            // this.router.navigateByUrl('/'); // forces the page to actually reload
            // this.fourZeroOneError();
            // need to handle telling the menu that an auth error happened
            // this.announceAuthError();
          }


          // this.createLog({ severity: 'ERROR', module: operation, message: error.message } as LogItem) 
          if (!skipMessage) {
            Toast.show({ text: this.message });
          }
        } else {
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
