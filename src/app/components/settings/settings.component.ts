import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Plugins, Toast } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { pushTokenStorageKey } from 'constants';
import { ceoRole } from 'constants';
import { memberRole } from 'constants';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, SettingsService } from 'src/app/services/settings.service';
import { environment } from 'src/environments/environment';

const { Modals, Storage } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  config: AppConfig;
  qrData: string;
  dataSubmitted: boolean;
  initialDataLoaded: boolean;
  isMember: boolean;
  ceoRights: boolean;

  constructor(
    private settingsService: SettingsService,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router
  ) { }

  async updateConfig() {
    await this.settingsService.setConfig(this.config);
    console.log('updated settings');
    this.settingsService.refreshData();
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

  async clearNotificationToken() {
    const tokenValue = await Storage.get({ key: pushTokenStorageKey });

    if (!tokenValue.value) {
      await Toast.show({
        text: 'You do not have a push token set!'
      });
      return;
    }

    const { value } = await Modals.confirm({
      title: 'Warning',
      message: 'Are you sure you want to clear your push token?'
    });

    if (value) {
      // remove it
      await Storage.remove({ key: pushTokenStorageKey });
      // notify
      await Toast.show({
        text: 'Push token removed. Restart app to reset!'
      });
    }
  }

  async ngOnInit() {
    this.config = await this.settingsService.getConfig();
    this.isMember = await this.authService.hasClaim(memberRole);
    this.ceoRights = await this.authService.hasClaim(ceoRole);
    console.log(`${ceoRole}:${this.ceoRights}`);
    
    this.qrData = environment.userQRBase + (await this.authService.retrieveUserSession()).character_id;
  }

}
