import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { Character, CharacterApplication, Job, NewCharacterApplication } from 'src/app/models/character.model';
import { ApplicationService } from 'src/app/services/application.service';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { OwnedShip, Ship } from 'src/app/models/ship.models';
import { ProfileService } from 'src/app/services/profile.service';
import { JobsService } from 'src/app/services/job.service';
import { OffenderService } from 'src/app/services/offender.service';

const { Storage, Toast } = Plugins;

@Component({
  selector: 'app-member-application',
  templateUrl: './member-application.page.html',
  styleUrls: ['./member-application.page.scss'],
})
export class MemberApplicationPage implements OnInit {
  hasApplicantClaim: boolean;
  isNative = this.platform.is('capacitor');
  ships: Ship[] = [];
  availableJobs: Job[] = [];

  // handle stuff
  handleCheckedOnce: boolean;
  handleValid: boolean;
  checkingHandle: boolean;

  // application object
  newApplication: NewCharacterApplication = {
    character: {} as Character,
    new_application: {} as CharacterApplication,
    owned_ship: {} as OwnedShip
  } as NewCharacterApplication;

  currentApplication: CharacterApplication;
  initialDataLoaded: boolean;
  readonly applicationStorageKeyName = 'application-progress';
  dataSubmitting: boolean;

  //
  loadingIndicator: any;

  readonly debounceInterval = 700; // ms

  constructor(
    private applicationService: ApplicationService,
    private profileService: ProfileService,
    private jobService: JobsService,
    private authService: AuthService,
    private loading: LoadingController,
    private router: Router,
    private platform: Platform,
    private offenderService: OffenderService
  ) { }

  async onFieldChange(event?: any) {
    this.storeApplicationProgress();
  }

  onHandleFieldChange(event?: any) {
    if (this.newApplication
      && this.newApplication.rsi_handle
      && this.newApplication.rsi_handle.length > 0) {
        this.checkingHandle = true;
        this.offenderService.verify_handle(this.newApplication.rsi_handle).subscribe(
          (result) => {
            this.checkingHandle = false;
            this.handleCheckedOnce = true;
            this.handleValid = result;
          }
        );
    }
  }

  async submitApplication() {
    if (this.valid()) {
      // create the loading/saving indicator
      this.loadingIndicator = await this.loading.create({
        message: 'Adding Application'
      });
      await this.loadingIndicator.present();

      this.dataSubmitting = true;
      this.applicationService.createApplication(this.newApplication).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          //
          this.currentApplication = results;
          this.clearApplicationProgress();
        } else {
          Toast.show({
            text: results.error.message,
            duration: 'long'
          });
        }

        this.dataSubmitting = false;

        if (this.loadingIndicator) {
          this.loading.dismiss();
        }
      });
    }
  }

  async doRefresh(event?: any) {
    await this.checkClaim();
    this.hasApplication(event);
  }

  async hasApplication(event?: any) {
    this.applicationService.fetchApplication().subscribe(async (results) => {
      if (!(results instanceof HttpErrorResponse)) {
        //
        this.currentApplication = results;
      } else {
        await this.fetchShips();
        await this.fetchOpenPositions();

        // try to fetch the application from storage
        const storedApplication = await this.recallApplicationProgress();
        if (storedApplication) {
          this.newApplication = storedApplication;

          // check the handle if its there
          if (this.newApplication.rsi_handle) {
            this.onHandleFieldChange();
          }
        }
      }

      //
      this.initialDataLoaded = true;

      if (event) {
        event.target.complete();
      }

      //
      if (this.loadingIndicator) {
        this.loading.dismiss();
      }
    });
  }

  valid(): boolean {
    if (this.newApplication
      && this.newApplication.character.first_name
      && this.newApplication.character.last_name
      && this.newApplication.character.description
      && this.newApplication.character.background
      && this.newApplication.new_application.why_do_want_to_join
      && this.newApplication.new_application.how_did_you_hear_about_us
      && this.newApplication.new_application.job_id
      && this.newApplication.owned_ship.ship_id
      && this.newApplication.owned_ship.title
      && this.newApplication.rsi_handle
      && this.handleValid) {
      return true;
    } else {
      return false;
    }
  }

  fetchShips(): Promise<void> {
    return new Promise(async (resolve) => {
      this.profileService.list_ships().subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.ships = results;
        }
        resolve();
      });
    });
  }

  fetchOpenPositions(): Promise<void> {
    return new Promise(async (resolve) => {
      this.jobService.list_hiring().subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.availableJobs = results;
        }
        resolve();
      });
    });
  }

  async storeApplicationProgress() {
    if (this.newApplication) {
      await Storage.set({
        key: this.applicationStorageKeyName,
        value: JSON.stringify(this.newApplication)
      });
    }
  }

  async recallApplicationProgress(): Promise<NewCharacterApplication> {
    const { value } = await Storage.get({ key: this.applicationStorageKeyName });
    if (value) {
      return JSON.parse(value);
    }
  }

  private async clearApplicationProgress() {
    await Storage.remove({ key: this.applicationStorageKeyName });
  }

  async checkClaim() {
    this.hasApplicantClaim = await this.authService.hasClaim(-2);

    if (!this.hasApplicantClaim) {
      Toast.show({
        text: 'You are not authorized to view this page!'
      });
      this.router.navigateByUrl('/dashboard');
    }
  }

  async ngOnInit() {
    await this.checkClaim();

    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    this.hasApplication();
  }

}
