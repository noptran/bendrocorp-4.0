import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Character, CharacterApplicationComment } from 'src/app/models/character.model';
import { ApplicationService } from 'src/app/services/application.service';
import { ProfileService } from 'src/app/services/profile.service';

import { Plugins } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';

const { Modals } = Plugins;
const { Toast } = Plugins;

@Component({
  selector: 'app-profile-application',
  templateUrl: './profile-application.page.html',
  styleUrls: ['./profile-application.page.scss'],
})
export class ProfileApplicationPage implements OnInit {
  character: Character;
  newComment: CharacterApplicationComment;

  loadingIndicator: any;

  // permissions
  ceoRights: boolean;
  hrRights: boolean;
  directorRights: boolean;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private applicationService: ApplicationService,
    private loading: LoadingController,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  async addApplicationComment() {
    if (this.newComment.comment.length > 0) {
      this.newComment.application_id = this.character.application.id;
      this.applicationService.addApplicationComment(this.newComment).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.character.application.comments.push(results);
          this.newComment = { } as CharacterApplicationComment;
          this.profileService.refreshData();
        }
      });
    } else {
      const alertRet = await Modals.alert({
        title: 'Missing Info',
        message: 'You must enter an actual comment!'
      });
    }
  }

  async securityCheck() {
    this.ceoRights = await this.authService.hasClaim(9);
    this.hrRights = await (this.authService.hasClaim(12) || this.authService.hasClaim(9));
    this.directorRights = await this.authService.hasClaim(3);

    if (!(this.ceoRights || this.hrRights || (this.character.application && this.character.application.application_status_id < 6))) {
      Toast.show({ text: 'You are not authorized to view this page!' });
      this.router.navigate(['profiles']);
      return;
    }
  }

  async ngOnInit() {
    this.newComment = { } as CharacterApplicationComment;


    if (this.router.getCurrentNavigation().extras.state) {
      console.log('Loading route info');
      await this.securityCheck();
      this.character = this.router.getCurrentNavigation().extras.state.character;
      console.log(this.character);
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

}
