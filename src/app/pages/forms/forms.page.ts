import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { AddUpdateOffenderReportComponent } from 'src/app/components/offender-reports/add-update-offender-report/add-update-offender-report.component';
import { Report } from 'src/app/models/report.model';
import { ReportService } from 'src/app/services/report.service';

import { ActionSheetOptionStyle, Plugins } from '@capacitor/core';
import { AddUpdateFormComponent } from 'src/app/components/forms/add-update-form/add-update-form.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
const { Toast } = Plugins;
const { Modals } = Plugins;

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit, OnDestroy {
  // report arrays
  reports: Report[] = [];
  // myReports: Report[] = [];
  reportsForMe: Report[] = [];
  //
  initialDataLoaded: boolean;
  updateSubscription: Subscription;
  userId: number;
  isAdmin: boolean;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;

  constructor(
    private reportService: ReportService,
    private loading: LoadingController,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.updateSubscription = this.reportService.reportsRefreshAnnounced$.subscribe(() => {
      this.fetchReports();
    });
  }

  async fetchReports(event?: any) {
    this.reportService.listReports().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.reports = results.filter(x => x.user_id === this.userId);
        this.reportsForMe = results.filter(x => x.user_id !== this.userId);

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
    // nav to the details
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        report
      }
    };
    this.router.navigate([report.id], navigationExtras);
  }

  async addUpdateReport(report?: Report) {
    const modal = await this.modalController.create({
      component: AddUpdateFormComponent,
      componentProps: {
        report
      },
      backdropDismiss: false
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
      message: 'Archiving'
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
    this.userId = (await this.authService.retrieveUserSession()).id;
    this.isAdmin = await this.authService.hasClaim(49);

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

  async showActions(event: MouseEvent, report: Report) {
    event.preventDefault();

    if ((report.draft && report.user_id === this.userId) || this.isAdmin) {
      const promptRet = await Modals.showActions({
        title: 'Report Options',
        options: [
          {
            title: 'Open'
          },
          {
            title: 'Archive',
            style: ActionSheetOptionStyle.Destructive
          },
          {
            title: 'Cancel',
            style: ActionSheetOptionStyle.Cancel
          }
        ]
      });
      console.log('You selected', promptRet);

      if (promptRet.index === 0) {
        this.openReport(report);
      }

      if (promptRet.index === 1) {
        this.archiveReport(report);
      }
    } else {
      const promptRet = await Modals.showActions({
        title: 'Report Options',
        options: [
          {
            title: 'Open'
          },
          {
            title: 'Cancel',
            style: ActionSheetOptionStyle.Cancel
          }
        ]
      });
      console.log('You selected', promptRet);

      if (promptRet.index === 0) {
        this.openReport(report);
      }
    }
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

}
