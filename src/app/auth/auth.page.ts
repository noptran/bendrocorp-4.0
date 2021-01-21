import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../models/user.model';
import { Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';
const { Toast, Device } = Plugins;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  login: LoginRequest = {} as LoginRequest;
  isWeb: boolean;
  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform
  ) { }

  /**
   * Call the login service with the filled in form object and attempt to authenticate the user
   */
  async doLogin()
  {
    const { uuid, operatingSystem, platform } = await Device.getInfo();
    this.authService.login(
      {
        email: this.login.email,
        password: this.login.password,
        code: this.login.code,
        device: `${platform}:${operatingSystem}:${uuid}`
      }
      )
    .subscribe(async (response) => {
      if (!(response instanceof HttpErrorResponse)) {
        await this.authService.storeAuthResponse(response);
        this.authService.announceAuthUpdate('LOGIN');
        this.router.navigateByUrl('/');
      } else {
        await Toast.show({
          text: response.error.message,
          duration: 'long'
        });
      }
    });
  }

  ionViewWillEnter() {
    this.login = {} as LoginRequest;
  }

  async ngOnInit() {
    this.isWeb = this.platform.is('desktop');
    const { uuid } = await Device.getInfo();
    if (!environment.production) {
      console.log(uuid);
    }
  }

}
