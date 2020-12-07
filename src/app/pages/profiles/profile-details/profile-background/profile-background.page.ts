import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { Character } from 'src/app/models/character.model';
import { ProfileService } from 'src/app/services/profile.service';
import { ProfileUpdateBackgroundPage } from '../profile-update-background/profile-update-background.page';

import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;

@Component({
  selector: 'app-profile-background',
  templateUrl: './profile-background.page.html',
  styleUrls: ['./profile-background.page.scss'],
})
export class ProfileBackgroundPage implements OnInit, OnDestroy {
  character: Character;
  characterSubscription: Subscription;
  userIsOwner: boolean;
  hrRights: boolean;
  canEdit: boolean;

  // loading indicator
  loadingIndicator: any;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthService,
    private modalController: ModalController,
    private loading: LoadingController,
    private route: ActivatedRoute,
  ) {
    this.characterSubscription = this.profileService.dataRefreshAnnounced$.subscribe(() => {
      if (this.character && this.character.id) {
        this.profileService.fetch(this.character.id).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.character = results;
          }
        });
      }
    });
  }

  async openUpdateBackground() {
    if (this.canEdit) {
      const modal = await this.modalController.create({
        component: ProfileUpdateBackgroundPage,
        componentProps: {
          character: this.character
        }
      });
      return await modal.present();
    }
  }

  async Initialize()
  {
    console.log('profile background init');

    if (this.router.getCurrentNavigation()?.extras.state) {
      this.hrRights = (await this.authService.hasClaim(12) || await this.authService.hasClaim(9));
      console.log('Loading route info');
      this.character = this.router.getCurrentNavigation().extras.state.character;
      this.userIsOwner = ((await this.authService.retrieveUserSession()).id === this.character.user_id) ? true : false;
      this.canEdit = this.hrRights || this.userIsOwner;
      console.log(this.character);
    } else {
      this.hrRights = (await this.authService.hasClaim(12) || await this.authService.hasClaim(9));

      // create the loading indicator
      this.loadingIndicator = await this.loading.create({
        message: 'Loading'
      });
      await this.loadingIndicator.present();

      // go look up the data
      const characterId = parseInt(this.route.snapshot.paramMap.get('id'), null);
      this.profileService.fetch(characterId).subscribe(async (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.character = results;
          this.userIsOwner = ((await this.authService.retrieveUserSession()).id === this.character.user_id) ? true : false;
          this.canEdit = this.hrRights || this.userIsOwner;
          this.loading.dismiss();
        } else {
          await Toast.show({
            text: 'Error Occured: Could not load background data!'
          });
          this.router.navigate(['profiles', characterId]);
        }
      });
    }
  }

  async ionViewWillEnter() {
    if (!this.character) {
      await this.Initialize();
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.characterSubscription) {
      this.characterSubscription.unsubscribe();
    }
  }

}
