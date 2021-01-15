import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor
{
constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.includes('auth')
    && !request.url.includes('register')
    && !request.url.includes('forgot-password')
    && !request.url.includes('reset-password')) {
      console.log('interceptor triggered');
    //   console.log(request.url);
      return from(
          this.authService.checkAndRefreshAccessToken()
              .then((accessTokenResponse: string) => {
                  const authHeader = `Bearer ${accessTokenResponse}`;
                  return request.clone({
                      // withCredentials: true,
                      setHeaders: {
                          Authorization: authHeader,
                      }
                  });
              })
      )
          .pipe(
              mergeMap(nextReq => next.handle(nextReq)),
              tap(
                  event => {}, // tslint:disable-line
                  err => {
                      if (err instanceof HttpErrorResponse && err.status === 401) {
                          console.log('401 error recieved from API');
                      } else {
                          throw err;
                      }
                  }
              )
          );
    } else {
        // whatever the request is we always want to try and tack on credentials
        const cloned = request.clone({
            // withCredentials: true
        });

        return next.handle(cloned);
    }
  }
}
