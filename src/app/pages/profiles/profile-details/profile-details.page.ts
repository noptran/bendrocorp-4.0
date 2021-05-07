import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { Character } from 'src/app/models/character.model';
import { ApplicationService } from 'src/app/services/application.service';
import { ProfileService } from 'src/app/services/profile.service';

import { Plugins } from '@capacitor/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { UpdateAvatarComponent } from 'src/app/components/update-avatar/update-avatar.component';
const { Modals } = Plugins;

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit, OnDestroy {

  // character
  characterId: number;
  character: Character;

  // permissions
  ceoRights: boolean;
  hrRights: boolean;
  directorRights: boolean;
  userIsOwner: boolean;
  canEdit: boolean;

  // subscriptions
  profileSubscription: Subscription;
  resizeSubscription: Subscription;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;

  // other
  showNameInDetailsHeader: boolean;

  constructor(
    private profileService: ProfileService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private loading: LoadingController,
    private router: Router,
    private platform: Platform,
    private modalController: ModalController
  ) {
    this.profileSubscription = this.profileService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchCharacter();
    });

    this.resizeSubscription = this.platform.resize.subscribe(() => {
      this.checkScreenSize();
    });
  }

  fetchCharacter() {
    this.profileService.fetch(this.characterId).subscribe(async (results) => {
      console.log(results);
      this.character = results;
      this.userIsOwner = ((await this.authService.retrieveUserSession()).id === this.character.user_id) ? true : false;
      this.canEdit = this.hrRights || this.userIsOwner;
      this.loadingIndicator.dismiss();
    });
  }

  async updateAvatar() {
    if (this.canEdit) {
      const modal = await this.modalController.create({
        component: UpdateAvatarComponent,
        componentProps: {
          character: this.character
        }
      });
      return await modal.present();
    }
  }

  openProfileBackground() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        character: this.character
      }
    };

    this.router.navigate(['background'], navigationExtras);
  }

  openProfileServiceRecord() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        character: this.character
      }
    };

    this.router.navigate(['service-record'], navigationExtras);
  }

  openProfileApplication() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        character: this.character
      }
    };

    this.router.navigate(['application'], navigationExtras);
  }

  openProfileInterview() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        character: this.character
      }
    };

    this.router.navigate(['interview'], navigationExtras);
  }

  openProfileShips() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        character: this.character
      }
    };

    this.router.navigate(['ships'], navigationExtras);
  }

  async advanceApplication() {
    if (this.hrRights) {
      const confirmRet = await Modals.confirm({
        title: 'Confirm',
        message: 'Are you sure you want advance this application?'
      });

      if (confirmRet.value) {
        this.applicationService.advanceApplication(this.character).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.profileService.refreshData();
          }
        });
      }
    }
  }

  async rejectApplication() {
    if (this.hrRights) {
      const confirmRet = await Modals.confirm({
        title: 'Confirm',
        message: 'Are you sure you want reject this application?'
      });

      if (confirmRet.value) {
        this.applicationService.rejectApplication(this.character).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.profileService.refreshData();
          }
        });
      }
    }
  }

  async ionViewWillEnter() {
    if (!this.character) {
      await this.Initialize();
    }
  }

  checkScreenSize() {
    this.showNameInDetailsHeader = this.platform.width() > 500;
  }

  async Initialize()
  {
    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    this.checkScreenSize();

    this.ceoRights = await this.authService.hasClaim(9);
    console.log(`ceo rights ${this.ceoRights}`);

    this.hrRights = (await this.authService.hasClaim(12) || await this.authService.hasClaim(9));
    console.log(`hr rights ${this.hrRights}`);

    this.directorRights = await this.authService.hasClaim(3);
    console.log(`director rights ${this.directorRights}`);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.characterId = this.router.getCurrentNavigation().extras.state.character.id;
        console.log(this.characterId);
        if (this.characterId) {
          this.fetchCharacter();
        } else {
          this.router.navigateByUrl('/profiles');
        }
      } else {
        this.characterId = parseInt(this.route.snapshot.paramMap.get('id'), null);
        this.fetchCharacter();
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

}
