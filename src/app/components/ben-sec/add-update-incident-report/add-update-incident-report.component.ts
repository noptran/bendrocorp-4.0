import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Field, FieldDescriptor } from 'src/app/models/field.model';
import { IncidentReport } from 'src/app/models/intel.model';
import { FieldService } from 'src/app/services/field.service';
import { IncidentService } from 'src/app/services/incident-service.service';

@Component({
  selector: 'app-add-update-incident-report',
  templateUrl: './add-update-incident-report.component.html',
  styleUrls: ['./add-update-incident-report.component.scss'],
})
export class AddUpdateIncidentReportComponent implements OnInit, OnDestroy {
  passedHandle: string;
  incidentReport: IncidentReport;

  dataSubmitting: boolean;
  searchInvalid: boolean;
  initialDataLoaded = false;
  formAction: string;
  tickerAction: string;
  loadingIndicator: any;

  // descriptors
  starObjects: FieldDescriptor[];
  forceLevels: FieldDescriptor[];
  citations: FieldDescriptor[];
  ships: FieldDescriptor[];

  // meta
  openedAsModal = false;

  constructor(
    private modalController: ModalController,
    private fieldService: FieldService,
    private incidentService: IncidentService,
    private loading: LoadingController
  ) { }

  async addUpdateIncidentReport() {
    // show the ticker
    this.loadingIndicator = await this.loading.create({
      message: this.tickerAction
    });
    await this.loadingIndicator.present();

    if (this.incidentReport && this.incidentReport.id) {
      this.incidentService.updateReport(this.incidentReport).subscribe(async (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          // close the modal since we did the thing
          this.dismiss();
          this.incidentService.refreshData();
        }

        // dismiss the ticker
        await this.loadingIndicator.dismiss();
      });
    } else {
      this.incidentService.createReport(this.incidentReport).subscribe(async (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          // TODO
          // forward to the incident report
          // path a, ben-safe/incident-:id
          // path b, ben-sec/report-:id

          this.dismiss();
          this.incidentService.refreshData();
        }

        // dismiss the ticker
        await this.loading.dismiss();
      });
    }
  }

  occuredWhenChanged(event?: any) {
    console.log(event);
    this.incidentReport.occured_when_ms = new Date(this.incidentReport.occured_when).getTime();
  }

  starObjectSelected(event?: any) {
    this.incidentReport.star_object_id = this.incidentReport.star_object.id;
  }

  forceLevelSelected(event?: any) {
    this.incidentReport.force_used_id = this.incidentReport.force_used.id;
  }

  shipUsedSelected(event?: any) {
    this.incidentReport.ship_used_id = this.incidentReport.ship_used.id;
  }

  formValid() {
    if (
      (this.incidentReport && !this.incidentReport.submit_for_approval)
      || (this.incidentReport && this.incidentReport.submit_for_approval
        && this.incidentReport.occured_when_ms
        && this.incidentReport.description
        && this.incidentReport.star_object_id
        && this.incidentReport.force_used_id
        && (this.incidentReport.infractions && this.incidentReport.infractions.length > 0))
    ) {
      return true;
    } else {
      return false;
    }
  }

  async fetchDescriptors() {
    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    const starObjectField = '65c22ae1-d724-409f-9d66-d9f544cc6be6';
    const forceLevelField = 'c08e36f8-d62d-4c8d-a631-835fa9336105';
    const citationField = '042e341b-7043-4d03-8c87-ecd76a0530ee';
    const shipField = '0b7f5349-dafa-47aa-837b-8a8ba248d9a5';

    this.fieldService.getFieldMulti([starObjectField, forceLevelField, citationField, shipField]).subscribe(async (results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.starObjects = results.filter(item => item.field_id === starObjectField);
        this.forceLevels = results.filter(item => item.field_id === forceLevelField);
        this.citations = results.filter(item => item.field_id === citationField);
        this.ships = results.filter(item => item.field_id === shipField);

        if (this.loadingIndicator) {
          await this.loadingIndicator.dismiss();
        }
        this.initialDataLoaded = true;
      }
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    if (this.incidentReport && this.incidentReport.id) {
      this.formAction = 'Update';
      this.tickerAction = 'Updating';

      // set occured when ms
      if (this.incidentReport.occured_when) {
        this.incidentReport.occured_when_ms = new Date(this.incidentReport.occured_when).getTime();
      }
    } else {

      if (!this.passedHandle) {
        console.error('boo hiss');
        return;
      }
      this.incidentReport = { rsi_handle: this.passedHandle, submit_for_approval: false, infractions: [] } as IncidentReport;
      this.formAction = 'Create';
      this.tickerAction = 'Creating';
    }

    this.fetchDescriptors();
  }

  ngOnDestroy() {}
}
