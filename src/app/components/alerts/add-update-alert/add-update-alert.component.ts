import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Toast } from '@capacitor/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { SystemMapSystemDescriptor } from 'constants';
import { SystemMapMoonDescriptor } from 'constants';
import { SystemMapLocationDescriptor } from 'constants';
import { SystemMapSystemObjectDescriptor } from 'constants';
import { SystemMapSublocationDescriptor } from 'constants';
import { SystemMapSettlementDescriptor } from 'constants';
import { SystemMapPlanetDescriptor } from 'constants';
import { BendroAlert } from 'src/app/models/alert.model';
import { FieldDescriptor } from 'src/app/models/field.model';
import { StarObject } from 'src/app/models/system-map.model';
import { AlertService } from 'src/app/services/alert.service';
import { FieldService } from 'src/app/services/field.service';
import { SystemMapService } from 'src/app/services/system-map.service';

@Component({
  selector: 'app-add-update-alert',
  templateUrl: './add-update-alert.component.html',
  styleUrls: ['./add-update-alert.component.scss'],
})
export class AddUpdateAlertComponent implements OnInit {
  alert: BendroAlert;
  alertTypes: FieldDescriptor[] = [];
  starObjects: StarObject[] = [];
  formAction: string;
  openedAsModal = true;
  dataSubmitted: boolean;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;

  constructor(
    private alertService: AlertService,
    private fieldService: FieldService,
    private loading: LoadingController,
    private modalController: ModalController,
    private systemMapService: SystemMapService
  ) { }

  valid() {
    if (this.alert.title
      && this.alert.description
      && this.alert.alert_type_id) {
      return true;
    } else {
      return false;
    }
  }

  expirationInPast(): boolean {
    if (this.alert && this.alert.expires && this.alert.expires < new Date()) {
      return true;
    } else {
      return false;
    }
  }

  clearExpiration() {
    this.alert.expires = null;
  }

  soChange(event?: any) {
    this.alert.star_object_id = event.value.id;
  }

  async submitForm() {
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

    // translate the time for easier adding into the API
    if (this.alert.expires) {
      this.alert.expires_ms = new Date(this.alert.expires).getTime();
    }

    // call the API
    this.dataSubmitted = true;
    if (this.alert.id) {
      this.alertService.update(this.alert).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.alertService.refreshData();
          Toast.show({
            text: 'Alert updated!'
          });

          this.dismiss();
        }

        this.dataSubmitted = false;
        if (this.loadingIndicator) {
          this.loading.dismiss();
        }
      });
    } else {
      this.alertService.create(this.alert).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.alertService.refreshData();
          Toast.show({
            text: 'Alert created!'
          });

          this.dismiss();
        }

        this.dataSubmitted = false;
        if (this.loadingIndicator) {
          this.loading.dismiss();
        }
      });
    }
  }

  loadAlertTypes() {
    this.fieldService.getField('7d4208ae-7c7d-4efe-aa9d-31fd6514af11').subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.alertTypes = results;
      }
    });
  }

  loadStarObjects() {
    this.systemMapService.listStarObjects().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.starObjects = results.filter(x => {
          if (
            x.object_type_id === SystemMapSystemDescriptor
            || x.object_type_id === SystemMapPlanetDescriptor
            || x.object_type_id === SystemMapMoonDescriptor
            || x.object_type_id === SystemMapSettlementDescriptor
            || x.object_type_id === SystemMapLocationDescriptor
            || x.object_type_id === SystemMapSublocationDescriptor
            || x.object_type_id === SystemMapSystemObjectDescriptor
          ) {
            return x;
          }
        });
      }
    });
  }

  dismiss() {
    if (this.openedAsModal) {
      this.modalController.dismiss();
    }
  }

  ngOnInit() {
    if (this.alert && this.alert.id) {
      this.formAction = 'Update';
    } else {
      this.alert = {} as BendroAlert;
      this.formAction = 'Create';
    }

    this.loadStarObjects();
    this.loadAlertTypes();
  }

}
