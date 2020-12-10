import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { SettingsService } from 'src/app/services/settings.service';
import { environment } from 'src/environments/environment';

const { Modals } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  qrData: string;

  constructor(
    private settingsService: SettingsService,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router
  ) { }

  async logout() {
    let confirmRet = await Modals.confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?'
    });

    if (confirmRet && confirmRet.value) {
      await this.authService.logout();
      this.authService.announceAuthUpdate('LOGOUT');
      this.router.navigateByUrl('/auth');
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async ngOnInit() {
    this.qrData = environment.userQRBase + (await this.authService.retrieveUserSession()).character_id;
  }

}
