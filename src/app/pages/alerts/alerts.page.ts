import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { AddUpdateAlertComponent } from 'src/app/components/alerts/add-update-alert/add-update-alert.component';
import { ViewAlertComponent } from 'src/app/components/alerts/view-alert/view-alert.component';
import { BendroAlert } from 'src/app/models/alert.model';
import { AlertService } from 'src/app/services/alert.service';
import { FieldService } from 'src/app/services/field.service';

import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;
const { Modals } = Plugins;

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
})
export class AlertsPage implements OnInit, OnDestroy {
  alerts: BendroAlert[];
  initialDataLoaded: boolean;
  updateSubscription: Subscription;
  isAdmin: boolean;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;

  constructor(
    private alertService: AlertService,
    private loading: LoadingController,
    private modalController: ModalController,
    private authService: AuthService
  ) {
    this.updateSubscription = this.alertService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchAlerts();
    });
  }

  async fetchAlerts(event?: any) {
    this.alertService.list().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.alerts = results;
        this.initialDataLoaded = true;
      }

      if (this.loadingIndicator) {
        this.loading.dismiss();
      }

      if (event) {
        event.target.complete();
      }
    });
  }

  doRefresh(event: any) {
    this.fetchAlerts(event);
  }

  async addUpdateAlert(alert?: BendroAlert) {
    if (alert) {
      console.log(alert);
    }

    const modal = await this.modalController.create({
      component: AddUpdateAlertComponent,
      componentProps: {
        alert
      }
    });
    return await modal.present();
  }

  async viewAlert(alert: BendroAlert) {
    const modal = await this.modalController.create({
      component: ViewAlertComponent,
      componentProps: {
        alert
      }
    });
    return await modal.present();
  }

  async archiveAlert(alert: BendroAlert) {
    // make sure we want to archive it
    const { value } = await Modals.confirm({
      title: 'Confirm',
      message: 'Are you sure you want to archive this alert?'
    });

    if (!value) {
      return;
    }

    // spin the spinner
    // setup the loading indicator
    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    while (!this.loadingIndicator) {
      // this might be a terrible idea...
      // but it should create a temp ms long hold to prevent the app from the skipping past the indicator being loaded
    }

    // make the call
    this.alertService.archive(alert).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.alertService.refreshData();

        Toast.show({
          text: 'Alert archived!'
        });
      }

      if (this.loadingIndicator) {
        this.loading.dismiss();
      }
    });
  }

  async ngOnInit() {
    this.isAdmin = await this.authService.hasClaim(2);

    // spin the spinner
    // setup the loading indicator
    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    while (!this.loadingIndicator) {
      // this might be a terrible idea...
      // but it should create a temp ms long hold to prevent the app from the skipping past the indicator being loaded
    }

    this.fetchAlerts();
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

}
