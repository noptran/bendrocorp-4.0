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
    if (/*this.authService.getAuthResponse() &&*/ !request.url.includes('auth')) {
      console.log('interceptor triggered');
      console.log(request.url);
      return from(
          this.authService.checkAndRefreshAccessToken()
              .then((accessTokenResponse: string) => {
                  const authHeader = `Bearer ${accessTokenResponse}`;
                  return request.clone({
                      withCredentials: true,
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
                          // this.authService.redirectToLogin();
                          // this.auth.clearCacheForScope(token);
                          // this.broadcastService.broadcast("msal:notAuthorized", err.message);

                          // redirect the user if the session error header is included
                          // if (err.headers.get('X-UTPM-SESSION-ERROR')) {
                          //     this.authService.redirectToLogin();
                          // }
                      } else {
                          throw err;
                      }
                  }
              )
          );
    } else {
        // whatever the request is we always want to try and tack on credentials
        const cloned = request.clone({
            withCredentials: true
        });

        return next.handle(cloned);
    }
  }
}
