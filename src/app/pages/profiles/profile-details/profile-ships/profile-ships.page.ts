import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { Character } from 'src/app/models/character.model';
import { OwnedShip } from 'src/app/models/ship.models';
import { ProfileService } from 'src/app/services/profile.service';
import { ProfileShipsAddUpdatePage } from '../profile-ships-add-update/profile-ships-add-update.page';

import { Plugins, Toast } from '@capacitor/core';

const { Modals } = Plugins;

@Component({
  selector: 'app-profile-ships',
  templateUrl: './profile-ships.page.html',
  styleUrls: ['./profile-ships.page.scss'],
})
export class ProfileShipsPage implements OnInit, OnDestroy {
  character: Character;
  userIsOwner: boolean;
  hrRights: boolean;
  canEdit: boolean;

  profileSubscription: Subscription;

  loadingIndicator: HTMLIonLoadingElement;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthService,
    private modalController: ModalController,
    private loading: LoadingController,
    private route: ActivatedRoute,
  ) {
    this.profileSubscription = this.profileService.dataRefreshAnnounced$.subscribe(() => {
      this.profileService.fetch(this.character.id).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.character = results;
        }
      });
    });
  }

  async addUpdateShip(ownedShip?: OwnedShip) {
    if (this.canEdit) {
      const modal = await this.modalController.create({
        component: ProfileShipsAddUpdatePage,
        componentProps: {
          ownedShip,
          character: this.character
        }
      });
      return await modal.present();
    }
  }

  async archiveShip(ownedShip: OwnedShip) {
    if (this.canEdit) {

      const confirmRet = await Modals.confirm({
        title: 'Confirm',
        message: 'Are you sure you want to archive this ship?'
      });

      if (confirmRet) {
        this.profileService.removeShip(ownedShip).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.character.owned_ships.splice(this.character.owned_ships.findIndex(x => x.id === ownedShip.id), 1);
            this.profileService.refreshData();
          }
        });
      }
    }
  }

  async ngOnInit() {

    if (this.router.getCurrentNavigation().extras.state) {
      console.log('Loading route info');
      this.character = this.router.getCurrentNavigation().extras.state.character;
      this.userIsOwner = ((await this.authService.retrieveUserSession()).id === this.character.user_id) ? true : false;


      this.hrRights = (await this.authService.hasClaim(12) || await this.authService.hasClaim(9));
      this.canEdit = this.hrRights || this.userIsOwner;

      console.log(this.character);
    } else {
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

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

}
