import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { Character } from 'src/app/models/character.model';
import { ApplicationService } from 'src/app/services/application.service';
import { ProfileService } from 'src/app/services/profile.service';

import { Plugins } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
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

  // subscriptions
  profileSubscription: Subscription;

  // loading indicator
  loadingIndicator: any;

  constructor(
    private profileService: ProfileService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private loading: LoadingController,
    private router: Router
  ) {
    this.profileSubscription = this.profileService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchCharacter();
    });
  }

  fetchCharacter() {
    this.profileService.fetch(this.characterId).subscribe((results) => {
      console.log(results);
      this.character = results;
    });
  }

  openProfileBackground() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        character: this.character
      }
    };

    this.router.navigate(['profile-background'], navigationExtras);
  }

  openProfileServiceRecord() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        character: this.character
      }
    };

    this.router.navigate(['profile-service-record'], navigationExtras);
  }

  openProfileApplication() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        character: this.character
      }
    };

    this.router.navigate(['profile-application'], navigationExtras);
  }

  openProfileInterview() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        character: this.character
      }
    };

    this.router.navigate(['profile-interview'], navigationExtras);
  }

  openProfileShips() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        character: this.character
      }
    };

    this.router.navigate(['profile-ships'], navigationExtras);
  }

  async advanceApplication() {
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

  async rejectApplication() {
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

  async ngOnInit() {
    this.ceoRights = await this.authService.hasClaim(9);
    this.hrRights = await (this.authService.hasClaim(12) || this.authService.hasClaim(9));
    this.directorRights = await this.authService.hasClaim(3);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.characterId = this.router.getCurrentNavigation().extras.state.character.id;
        console.log(this.characterId);
        if (this.characterId) {
          this.fetchCharacter();
        } else {
          this.router.navigateByUrl('/more/profile');
        }
      } else {
        this.characterId = parseInt(this.route.snapshot.paramMap.get('id'), null);
        this.fetchCharacter();
      }
    });
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

}
