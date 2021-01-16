import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { RegistrationService } from 'src/app/services/registration.service';
import { PasswordSet } from 'src/app/models/password-set.model';

import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;

@Component({
  selector: 'app-forgot-password-complete',
  templateUrl: './forgot-password-complete.page.html',
  styleUrls: ['./forgot-password-complete.page.scss'],
})
export class ForgotPasswordCompletePage implements OnInit {
  private passwordSet: PasswordSet;
  submissionError: string;
  submissionMessage: string;
  dataSubmitting = false;
  isValid: boolean;
  token: string = this.route.snapshot.paramMap.get('token');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private registrationService: RegistrationService
  ) { }

  setPassword(event: PasswordSet) {
    this.passwordSet = event;
  }

  submitRequest()
  {
    if (this.isValid) {
      this.dataSubmitting = true;
      this.submissionMessage = null;
      this.submissionError = null;
      this.registrationService.doPasswordReset(this.passwordSet.password, this.passwordSet.password_confirmation, this.token).subscribe(
        (results) => {
          this.dataSubmitting = false;
          if (!(results instanceof HttpErrorResponse)) {
            Toast.show({
              text: 'Request completed! Please login with the password you just entered!'
            });
            this.router.navigateByUrl('/auth');
          } else {
            // this.submissionError = results.error.message;
            Toast.show({
              text: results.error.message,
              duration: 'long'
            });
          }
        }
      );
    }
  }

  backToLogin() {
    this.router.navigateByUrl('/auth');
  }

  setPasswordValid(event: boolean) {
    this.isValid = event;
  }

  ngOnInit() {
    console.log(this.token);
  }

}
