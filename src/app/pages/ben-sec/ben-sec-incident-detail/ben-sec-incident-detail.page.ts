import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { IncidentReport } from 'src/app/models/intel.model';
import { IncidentService } from 'src/app/services/incident-service.service';

import { Plugins } from '@capacitor/core';
import { BendroSafeSearchResult } from 'src/app/models/safe-search-result';
import { BendroSafeService } from 'src/app/services/bendro-safe.service';
import { AddUpdateIncidentReportComponent } from 'src/app/components/ben-sec/add-update-incident-report/add-update-incident-report.component';
import { Subscription } from 'rxjs';
const { Toast } = Plugins;

@Component({
  selector: 'app-ben-sec-incident-detail',
  templateUrl: './ben-sec-incident-detail.page.html',
  styleUrls: ['./ben-sec-incident-detail.page.scss'],
})
export class BenSecIncidentDetailPage implements OnInit, OnDestroy {
  // creator or security
  isCreator: boolean;
  isSecurity: boolean;
  isBenSecAdmin: boolean;
  userId: number;

  writeAbleState: boolean;
  pendingState: boolean;

  incidentId: string;
  incidentReport: IncidentReport;
  searchResult: BendroSafeSearchResult;

  defaultReturnPath: string;
  loadingIndicator: any;

  initialDataLoaded: boolean;

  // subs
  reportSubscription: Subscription;

  constructor(
    private incidentService: IncidentService,
    private bendroSafe: BendroSafeService,
    private loading: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private modalController: ModalController
  ) {
    this.reportSubscription = this.incidentService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchIncidentReport();
    });
  }

  fetchIncidentReport(event?: any) {
    if (this.incidentId) {
      this.incidentService.fetchReport(this.incidentId).subscribe(async (result) => {
        if (!(result instanceof HttpErrorResponse)) {
          // NOTE: security check here? - currently the API just handles it

          // assign values
          this.incidentReport = result;
          this.setReturnPath();

          this.setUserVars();

          // get the safe search results for the header
          this.bendroSafe.search(result.rsi_handle).subscribe((search) => {
            if (!(search instanceof HttpErrorResponse)) {
              this.searchResult = search;
            }
            // if an event is sent dismiss it
            if (event) {
              event.target.complete();
            }

            this.initialDataLoaded = true;

            if (this.loadingIndicator) {
              this.loadingIndicator.dismiss();
            }
          });
        } else {
          console.log(result);
        }

        // dimiss the loading indicator
        if (this.loadingIndicator) {
          await this.loadingIndicator.dismiss();
        }
      });
    }
  }

  async updateIncidentReport() {
    if (this.incidentReport && this.incidentReport.id) {
      const modal = await this.modalController.create({
        component: AddUpdateIncidentReportComponent,
        componentProps: {
          passedHandle: this.searchResult.rsi_data.handle,
          incidentReport: this.incidentReport
        }
      });
      await modal.present();
    }
  }

  doReturn() {
    this.router.navigateByUrl(this.defaultReturnPath);
  }

  setReturnPath() {
    if (window.location.pathname.includes('ben-sec')) {
      this.defaultReturnPath = `/ben-sec/${this.incidentReport.intelligence_case_id.split('-')[0]}`;
    } else {
      this.defaultReturnPath = `/bendro-safe`;
    }
  }

  async setUserVars() {
    this.userId = (await this.authService.retrieveUserSession()).id;
    this.isSecurity = await this.authService.hasClaim(54);
    this.isBenSecAdmin = await this.authService.hasClaim(55);
    this.isCreator = (this.incidentReport.created_by_id === this.userId) ? true : false;

    this.writeAbleState = (this.incidentReport.approval_status_id === 'd593a55f-86fd-4cfa-88ce-1b8e38737c8c' // pending
    || this.incidentReport.approval_status_id === 'f4619ce3-2d7e-41cd-9286-7f889e8f17b6' ) // approved
    ? false : true;

    this.pendingState = this.incidentReport.approval_status_id === 'd593a55f-86fd-4cfa-88ce-1b8e38737c8c';

    console.log('report vars set');

  }

  doRefresh(event: any) {
    this.fetchIncidentReport(event);
  }

  mappedInfractions() {
    if (this.incidentReport && this.incidentReport.infractions) {
      return this.incidentReport.infractions.map(x => x.title);
    }
  }

  async ngOnInit() {
    // get the id from the route
    this.incidentId = this.route.snapshot.paramMap.get('incident_id');

    // // see if we got passed data
    // if (this.router.getCurrentNavigation().extras.state) {
    //   console.log('Loading route info');
    //   this.incidentReport = this.router.getCurrentNavigation().extras.state.incidentReport;
    //   console.log('passed incident report data');
    //   console.log(this.incidentReport);
    //   this.setReturnPath();

    //   this.setUserVars();

    //   this.bendroSafe.search(this.incidentReport.rsi_handle).subscribe((search) => {
    //     if (!(search instanceof HttpErrorResponse)) {
    //       this.searchResult = search;
    //     }

    //     this.initialDataLoaded = true;

    //     if (this.loadingIndicator) {
    //       this.loadingIndicator.dismiss();
    //     }
    //   });
    // } else {
    //   // create the loading indicator
    //   this.loadingIndicator = await this.loading.create({
    //     message: 'Loading'
    //   });
    //   await this.loadingIndicator.present();

    //   // go load the data
    //   this.fetchIncidentReport();
    // }
  }

  ngOnDestroy() {
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
  }

}
