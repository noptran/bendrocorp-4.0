import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) { }
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      try {
        const isTokenAvailable: boolean = (await this.authService.checkAndRefreshAccessToken()) != null;
        return isTokenAvailable;
      } catch (error) {
        console.error(error);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.authService.redirectToLogin();
          }
        }

        // default return of false if its not a 401
        return false;
      }
  }
}
