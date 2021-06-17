import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { IncidentReport } from 'src/app/models/intel.model';
import { BendroSafeSearchResult } from 'src/app/models/safe-search-result';
import { BendroSafeService } from 'src/app/services/bendro-safe.service';
import { IncidentService } from 'src/app/services/incident-service.service';
import { AddUpdateIncidentReportCommentComponent } from '../add-update-incident-report-comment/add-update-incident-report-comment.component';
import { AddUpdateIncidentReportComponent } from '../add-update-incident-report/add-update-incident-report.component';
import { Plugins, ActionSheetOptionStyle } from '@capacitor/core';

const { Modals } = Plugins;

@Component({
  selector: 'app-incident-report-detail-content',
  templateUrl: './incident-report-detail-content.component.html',
  styleUrls: ['./incident-report-detail-content.component.scss'],
})
export class IncidentReportDetailContentComponent implements OnInit, OnDestroy {
  //
  @Input() defaultReturnPath: string;
  @Output() defaultReturnPathChange = new EventEmitter<string>();
  @Input() initialDataLoaded: boolean;
  @Output() initialDataLoadedChange = new EventEmitter<boolean>();

  // creator or security
  isCreator: boolean;
  isSecurity: boolean;
  isBenSecAdmin: boolean;
  userId: number;

  writeAbleState: boolean;
  pendingState: boolean;
  approvalColor: string;

  incidentId: string;
  incidentReport: IncidentReport;
  searchResult: BendroSafeSearchResult;

  dispositionActionInProgress = false;

  loadingIndicator: any;

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
    this.incidentService.fetchReport(this.incidentId).subscribe(async (result) => {
      if (!(result instanceof HttpErrorResponse)) {
        // TODO: security check happens here - or leave it to the API?

        // assign values
        this.incidentReport = result;
        this.incidentId = result.id;
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
          this.initialDataLoadedChange.emit(this.initialDataLoaded);

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

  async approveReport() {
    if (this.isSecurity && this.incidentReport && this.incidentReport.id) {
      const { value } = await Modals.confirm({
        title: 'Confirm',
        message: 'Are you sure you want to approve this report?'
      });

      if (!value) {
        return;
      }

      // create the loading indicator
      this.loadingIndicator = await this.loading.create({
        message: 'Approving Report'
      });
      await this.loadingIndicator.present();

      this.dispositionActionInProgress = true;
      this.incidentService.approveReport(this.incidentReport.id).subscribe(async (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.incidentService.refreshData();
        }

        if (this.loadingIndicator) {
          await this.loadingIndicator.dismiss();
        }

        this.dispositionActionInProgress = false;
      });
    }
  }

  async declineReport() {
    if (this.isSecurity && this.incidentReport && this.incidentReport.id) {
      const { value } = await Modals.confirm({
        title: 'Confirm',
        message: 'Are you sure you want to approve this report?'
      });

      if (!value) {
        return;
      }

      // create the loading indicator
      this.loadingIndicator = await this.loading.create({
        message: 'Declining Report'
      });
      await this.loadingIndicator.present();

      this.dispositionActionInProgress = true;
      this.incidentService.declineReport(this.incidentReport.id).subscribe(async (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.incidentService.refreshData();
        }

        if (this.loadingIndicator) {
          await this.loadingIndicator.dismiss();
        }

        this.dispositionActionInProgress = false;
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

  // doReturn() {
  //   this.router.navigateByUrl(this.defaultReturnPath);
  // }

  setReturnPath() {
    if (window.location.pathname.includes('ben-sec')) {
      this.defaultReturnPath = `/ben-sec/${this.incidentReport.intelligence_case_id.split('-')[0]}`;
    } else {
      this.defaultReturnPath = `/bendro-safe`;
    }

    this.defaultReturnPathChange.emit(this.defaultReturnPath);
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

    if (this.incidentReport.approval_status_id === 'f4619ce3-2d7e-41cd-9286-7f889e8f17b6') { // approved
      this.approvalColor = 'success';
    } else if (this.incidentReport.approval_status_id === 'd9bbda83-e290-4b0c-88ff-1e15ab674640') { // declined
      this.approvalColor = 'danger';
    } else {
      this.approvalColor = 'medium';
    }

  }

  doRefresh(event: any) {
    this.fetchIncidentReport(event);
  }

  async createIncidentComment() {
    if (this.incidentReport && this.incidentReport.id && this.isSecurity) {
      const modal = await this.modalController.create({
        component: AddUpdateIncidentReportCommentComponent,
        componentProps: {
          reportId: this.incidentReport.id
        }
      });
      await modal.present();
    }
  }

  mappedInfractions() {
    if (this.incidentReport && this.incidentReport.infractions) {
      return this.incidentReport.infractions.map(x => x.title);
    }
  }

  async ngOnInit() {
    // get the id from the route
    this.incidentId = this.route.snapshot.paramMap.get('incident_id');

    // see if we got passed data
    if (this.router.getCurrentNavigation()?.extras?.state) {
      console.log('Loading route info');
      this.incidentReport = this.router.getCurrentNavigation().extras.state.incidentReport;
      console.log('passed incident report data');
      console.log(this.incidentReport);
      this.setReturnPath();

      this.setUserVars();

      this.bendroSafe.search(this.incidentReport.rsi_handle).subscribe((search) => {
        if (!(search instanceof HttpErrorResponse)) {
          this.searchResult = search;
        }

        this.initialDataLoaded = true;
        this.initialDataLoadedChange.emit(this.initialDataLoaded);

        if (this.loadingIndicator) {
          this.loadingIndicator.dismiss();
        }
      });
    } else {
      // create the loading indicator
      this.loadingIndicator = await this.loading.create({
        message: 'Loading'
      });
      await this.loadingIndicator.present();

      // go load the data
      this.fetchIncidentReport();
    }
  }

  ngOnDestroy() {
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
  }

}
