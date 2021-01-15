import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // activator
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      try {
        const isTokenAvailable = await this.authService.checkAndRefreshAccessToken(false, true);
        console.log(`no auth guard check returned: ${isTokenAvailable}`);
        if (isTokenAvailable) {
          // just redirect the user back to / and let the app figure out where they should go
          this.router.navigateByUrl('/');
          return false;
        } else {
          return true;
        }

        return !isTokenAvailable;
      } catch (error) {
        console.error(error);

        // default return of true, since if we cant find it or if something goes wrong just blow it up
        return true;
      }
  }
}
