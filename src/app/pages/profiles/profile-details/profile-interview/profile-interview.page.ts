import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Character } from 'src/app/models/character.model';
import { ApplicationService } from 'src/app/services/application.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ProfileInterviewHintsPage } from '../profile-interview-hints/profile-interview-hints.page';

import { Plugins } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';

const { Modals } = Plugins;
const { Toast } = Plugins;

@Component({
  selector: 'app-profile-interview',
  templateUrl: './profile-interview.page.html',
  styleUrls: ['./profile-interview.page.scss'],
})
export class ProfileInterviewPage implements OnInit {

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    private profileService: ProfileService,
    private modalController: ModalController,
    private loading: LoadingController,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }
  character: Character;
  lockForReview: boolean;

  loadingIndicator: HTMLIonLoadingElement;

  // permissions
  ceoRights: boolean;
  hrRights: boolean;
  directorRights: boolean;

  updateInterview() {
    if (this.lockForReview) {
      this.character.application.interview.locked_for_review = true;
    }

    this.applicationService.updateInterview(this.character.application.interview).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.profileService.refreshData();
      }
    });
  }

  async openInterviewHints() {
    const modal = await this.modalController.create({
      component: ProfileInterviewHintsPage,
      componentProps: {
        character: this.character
      }
    });
    return await modal.present();
  }

  async securityCheck() {
    this.ceoRights = await this.authService.hasClaim(9);
    this.hrRights = await (this.authService.hasClaim(12) || this.authService.hasClaim(9));
    this.directorRights = await this.authService.hasClaim(3);

    if (!(this.ceoRights || this.hrRights)) {
      Toast.show({ text: 'You are not authorized to view this page!' });
      this.router.navigate(['profiles']);
      return;
    }
  }

  async ngOnInit() {

    if (this.router.getCurrentNavigation()?.extras.state) {
      console.log('Loading route info');
      await this.securityCheck();

      this.character = this.router.getCurrentNavigation().extras.state.character;
      // console.log(this.character);
      // console.log(this.character.application.interview);
      this.lockForReview = this.character.application.interview.locked_for_review;
    } else {
      await this.securityCheck();

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
          this.loadingIndicator.dismiss();
        } else {
          await Toast.show({
            text: 'Error Occured: Could not load background data!'
          });
          this.router.navigate(['profiles', characterId]);
        }
      });
    }
  }

}
