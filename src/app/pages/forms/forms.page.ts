import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { AddUpdateOffenderReportComponent } from 'src/app/components/offender-reports/add-update-offender-report/add-update-offender-report.component';
import { Report } from 'src/app/models/report.model';
import { ReportService } from 'src/app/services/report.service';

import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;
const { Modals } = Plugins;

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit, OnDestroy {
  reports: Report[];
  initialDataLoaded: boolean;
  updateSubscription: Subscription;
  isAdmin: boolean;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;

  constructor(
    private reportService: ReportService,
    private loading: LoadingController,
    private modalController: ModalController,
    private authService: AuthService
  ) {
    this.updateSubscription = this.reportService.reportsRefreshAnnounced$.subscribe(() => {
      this.fetchReports();
    });
  }

  async fetchReports(event?: any) {
    this.reportService.listReports().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.reports = results;
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
    this.fetchReports(event);
  }

  openReport(report: Report) {
    //
  }

  async addUpdateReport(report?: Report) {
    const modal = await this.modalController.create({
      component: AddUpdateOffenderReportComponent,
      componentProps: {
        report
      }
    });
    return await modal.present();
  }

  async archiveReport(report: Report) {
    // make sure we want to archive it
    const { value } = await Modals.confirm({
      title: 'Confirm',
      message: 'Are you sure you want to archive this report?'
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
    this.reportService.archiveReport(report).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.reportService.refreshReportsData();

        Toast.show({
          text: 'Report archived!'
        });
      }

      if (this.loadingIndicator) {
        this.loading.dismiss();
      }
    });
  }

  async ngOnInit() {
    // this.isAdmin = await this.authService.hasClaim(2);

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

    this.fetchReports();
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

}
