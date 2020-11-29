import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  login: LoginRequest = {} as LoginRequest;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Call the login service with the filled in form object and attempt to authenticate the user
   */
  doLogin()
  {
    this.authService.login(
      this.login.email,
      this.login.password,
      this.login.code)
    .subscribe(async (response) => {
      if (!(response instanceof HttpErrorResponse)) {
        await this.authService.storeAuthResponse(response);
        this.authService.announceAuthUpdate('LOGIN');
        this.router.navigateByUrl('/');
      }
    });
  }

  ngOnInit() {
  }

}
