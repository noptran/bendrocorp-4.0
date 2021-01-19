import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { SignUp } from 'src/app/models/user.model';
import { Plugins } from '@capacitor/core';
import { RegistrationService } from 'src/app/services/registration.service';
import { PasswordSet } from 'src/app/models/password-set.model';
import { Platform } from '@ionic/angular';
const { Toast } = Plugins;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(
    private authService: AuthService,
    private registrationService: RegistrationService,
    private router: Router,
    private platform: Platform
  ) { }
  isWeb: boolean;
  registration: SignUp = { } as SignUp;
  termsAgreement: boolean;
  dataSubmitting = false;
  passwordValid: boolean;

  setPassword(event: PasswordSet) {
    this.registration.password = event.password;
    this.registration.password_confirmation = event.password_confirmation;
  }

  setPasswordValid(event: boolean) {
    this.passwordValid = event;
  }

  createSignUp()
  {
    if (this.valid()) {
      this.dataSubmitting = true;
      this.registrationService.signup(this.registration).subscribe(
        (result) => {
          this.dataSubmitting = false;
          if (!(result instanceof HttpErrorResponse)) {
            this.router.navigateByUrl('/auth');
            Toast.show({
              text: 'Registration completed successfully! Please login!'
            });
          } else {
            Toast.show({
              text: result.error.message,
              duration: 'long'
            });
          }
        }
      );
    } else {
      console.warn('Invalid input?!');
    }
  }

  valid(): boolean {
    if (
      this.registration.username
      && this.registration.email
      && this.registration.password
      && this.registration.password_confirmation
      && this.passwordValid
      && this.termsAgreement
    ) {
      return true;
    } else {
      return false;
    }
  }

  passwordMatch(): boolean {
    if ((!this.registration.password || !this.registration.password_confirmation)
    || (this.registration.password === this.registration.password_confirmation)) {
      return true;
    } else {
      return false;
    }
  }

  backToLogin() {
    this.router.navigateByUrl('/auth');
  }

  ionViewWillEnter() {
    this.registration = { } as SignUp;
  }

  ngOnInit() {
    this.isWeb = this.platform.is('desktop');
  }

}
