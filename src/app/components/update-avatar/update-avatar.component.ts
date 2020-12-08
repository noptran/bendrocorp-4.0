import { Component, OnInit, ViewChild } from '@angular/core';
import { Character } from 'src/app/models/character.model';
import { Plugins } from '@capacitor/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { Base64Upload } from 'src/app/models/misc.model';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
const { FileSelector, Toast } = Plugins;

@Component({
  selector: 'app-update-avatar',
  templateUrl: './update-avatar.component.html',
  styleUrls: ['./update-avatar.component.scss'],
})
export class UpdateAvatarComponent implements OnInit {
  // this just might be better than the old one... ¯\_(ツ)_/¯

  @ViewChild('webAvatarPicker', { static: true }) inputField: HTMLInputElement;

  character: Character;
  avatarData: string;
  newAvatar: Base64Upload;
  isMobile: boolean = this.platform.is('mobile');

  // rights check
  hrRights: boolean;
  ceoRights: boolean;
  canEdit: boolean;
  userIsOwner: boolean;

  // updating bool for when the form is run
  updating: boolean;

  // loading indicator
  loadingIndicator: any;

  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private profileService: ProfileService,
    private authService: AuthService,
    private loading: LoadingController,
  ) {
  }

  async ngOnInit() {
    this.updating = false;

    this.avatarData = this.character.avatar_url;
    this.ceoRights = await this.authService.hasClaim(9);
    this.hrRights = (await this.authService.hasClaim(12) || await this.authService.hasClaim(9));
    this.userIsOwner = ((await this.authService.retrieveUserSession()).id === this.character.user_id) ? true : false;

    // rights check
    this.canEdit = this.hrRights || this.userIsOwner || this.ceoRights;
  }

  async selectAvatarMobile() {
  // for web need to fall back to a look alike button
  // https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js

    if (this.isMobile) { // TODO: https://github.com/hinddeep/capacitor-file-selector
      const ext = ['images'];
      const selectedFile = await FileSelector.fileSelector({
        ext,
        multiple_selection: false
      });

      console.log(selectedFile);
    } else {
      this.selectAvatarWeb();
    }
  }

  async updateAvatar()
  {
    if (this.canEdit) {
      this.character.new_avatar = this.newAvatar;
      this.updating = true;

      // show the loader
      this.loadingIndicator = await this.loading.create();
      await this.loadingIndicator.present();

      // send the web call
      this.profileService.updateAvatar(this.character).subscribe(
        (result) => {
          if (!(result instanceof HttpErrorResponse)) {
            this.profileService.refreshData();
            this.updating = false;
            this.loading.dismiss();
            this.dismiss();
          }
        }
      );
    } else {
      Toast.show({ text: 'You are not authorized to edit this character1' });
    }
  }

  selectAvatarWeb() {
    // this.inputField.click();
    document.getElementById('webAvatarPicker').click();
  }

  async handleAvatarFileInput(files: FileList)
  {
    console.log(files);
    // fetch file data on file to uploads
    const file = files.item(0);

    if (file) {
      // add the avatar information to the user object so it can be uploaded
      const base64Result = await this.getBase64(file);

      this.newAvatar = { name: file.name, type: file.type, size: file.size, base64: base64Result } as Base64Upload;

      if (this.newAvatar.type === 'image/jpeg') {
        // fix the type
        this.newAvatar.type = 'image/jpg';

        // fix the file name
        this.newAvatar.name = this.newAvatar.name.replace('jpeg', 'jpg');

        // fix the base64
        this.newAvatar.base64 = this.newAvatar.base64.replace('jpeg', 'jpg');
      }

      console.log(this.newAvatar);

      this.avatarData = base64Result as string;
    }
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
