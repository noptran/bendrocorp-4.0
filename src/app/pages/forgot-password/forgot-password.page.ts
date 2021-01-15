import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RegistrationService } from 'src/app/services/registration.service';

import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { Toast } = Plugins;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  formEmail: string;
  requestCompleted: boolean;
  dataSubmitting: boolean;

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) { }

  submitRequest() {
    this.dataSubmitting = true;
    this.registrationService.requestPasswordReset(this.formEmail).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.requestCompleted = true;
        Toast.show({
          text: results.message,
          duration: 'long'
        });
        this.router.navigateByUrl('/auth');
      } else {
        this.dataSubmitting = false;
      }
    });
  }

  valid() {
    if (this.formEmail) {
      return true;
    } else {
      return false;
    }
  }

  backToLogin() {
    this.router.navigateByUrl('/auth');
  }

  ngOnInit() {
  }

}
