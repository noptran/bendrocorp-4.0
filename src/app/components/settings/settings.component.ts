import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, SettingsService } from 'src/app/services/settings.service';
import { environment } from 'src/environments/environment';

const { Modals } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  config: AppConfig;
  qrData: string;

  constructor(
    private settingsService: SettingsService,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router
  ) { }

  async updateConfig() {
    await this.settingsService.setConfig(this.config);
    console.log('updated settings');
  }

  async logout() {
    const confirmRet = await Modals.confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?'
    });

    if (confirmRet && confirmRet.value) {
      await this.authService.logout();
      this.authService.announceAuthUpdate('LOGOUT');
      this.router.navigateByUrl('/auth');
      this.dismiss();
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async ngOnInit() {
    this.config = await this.settingsService.getConfig();
    this.qrData = environment.userQRBase + (await this.authService.retrieveUserSession()).character_id;
  }

}
