import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { Character } from 'src/app/models/character.model';
import { ProfileService } from 'src/app/services/profile.service';

import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;

@Component({
  selector: 'app-profile-update-background',
  templateUrl: './profile-update-background.page.html',
  styleUrls: ['./profile-update-background.page.scss'],
})
export class ProfileUpdateBackgroundPage implements OnInit {
  character: Character;

  dataSubmitted: boolean = false;

  // perms - probably over protective... but ¯\_(ツ)_/¯
  userIsOwner: boolean;
  hrRights: boolean;
  canEdit: boolean;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private modalController: ModalController
  ) { }

  saveProfileBackground() {
    if (this.character && this.character.id) {
      this.dataSubmitted = true;
      this.profileService.update(this.character).subscribe(async (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          await Toast.show({
            text: 'Character updated!'
          });

          this.profileService.refreshData();
          this.dataSubmitted = false;
          this.dismiss();
        }
      });
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async ngOnInit() {
    this.hrRights = (await this.authService.hasClaim(12) || await this.authService.hasClaim(9));
    this.canEdit = this.hrRights || this.userIsOwner;

    if (this.character) {
      this.userIsOwner = ((await this.authService.retrieveUserSession()).id === this.character.user_id) ? true : false;
    }

    if (!this.canEdit) {
      this.dismiss();
    }
  }

}
