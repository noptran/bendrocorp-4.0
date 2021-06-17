import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { IntelligenceCase } from 'src/app/models/intel.model';
import { BendroSafeService } from 'src/app/services/bendro-safe.service';
import { FieldService } from 'src/app/services/field.service';
import { IntelService } from 'src/app/services/intel-service.service';
import { Plugins } from '@capacitor/core';
import { BendroSafeSearchResult } from 'src/app/models/safe-search-result';
import { HttpErrorResponse } from '@angular/common/http';
import { FieldDescriptor } from 'src/app/models/field.model';
import { AddUpdateIntelCaseCommentComponent } from 'src/app/components/ben-sec/add-update-intel-case-comment/add-update-intel-case-comment.component';
import { Subscription } from 'rxjs';
import { AddUpdateIntelReportComponent } from 'src/app/components/ben-sec/add-update-intel-report/add-update-intel-report.component';
import { IncidentService } from 'src/app/services/incident-service.service';
import { AddUpdateIncidentReportComponent } from 'src/app/components/ben-sec/add-update-incident-report/add-update-incident-report.component';
import { AddTagComponent } from 'src/app/components/ben-sec/add-tag/add-tag.component';
import { User } from 'src/app/models/user.model';
const { Toast } = Plugins;

@Component({
  selector: 'app-ben-sec-case-detail',
  templateUrl: './ben-sec-case-detail.page.html',
  styleUrls: ['./ben-sec-case-detail.page.scss'],
})
export class BenSecCaseDetailPage implements OnInit, OnDestroy {
  // main objects
  userId: number;
  caseId: string;
  intelligenceCase: IntelligenceCase;
  searchResult: BendroSafeSearchResult;
  threatLevels: FieldDescriptor[] = [];
  classifications: FieldDescriptor[] = [];
  availableOfficers: User[];

  // misc
  initialDataLoaded = false;
  hasReaderRights: boolean;
  hasWriterRights: boolean;
  hasAdminRights: boolean;
  isAssignee: boolean;
  loadingIndicator: any;

  // subs
  caseSubscription: Subscription;
  incidentSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private bendroSafe: BendroSafeService,
    private modalController: ModalController,
    private fieldService: FieldService,
    private intelService: IntelService,
    private loading: LoadingController,
    private incidentService: IncidentService
  ) {
    this.caseSubscription = this.intelService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchCase();
    });

    this.incidentSubscription = this.incidentService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchCase();
    });
  }

  doRefresh(event: any) {
    this.fetchCase(event);
  }

  selectedThreatLevel(event?: any) {
    console.log(event);
    this.intelligenceCase.threat_level_id = event.value.id;
    this.updateCurrentCase();
  }

  selectedClassificationLevel(event?: any) {
    console.log(event);
    this.intelligenceCase.classification_level_id = event.value.id;
    this.updateCurrentCase();
  }

  selectedAssignedTo(event?: any) {
    console.log(event);
    this.intelligenceCase.assigned_to_id = event.value.assigned_to_id;
    this.updateCurrentCase();
  }

  async updateCurrentCase() {
    this.intelService.updateCase(this.intelligenceCase).subscribe(async (result) => {
      if (!(result instanceof HttpErrorResponse)) {
        // await Toast.show({ text: 'Case updated!' });
        this.intelService.refreshData();
      }
    });
  }

  fetchCase(event?: any) {
    //
    if (this.caseId) {
      this.intelService.fetchCase(this.caseId).subscribe(async (result) => {
        if (!(result instanceof HttpErrorResponse)) {
          // get the case
          this.intelligenceCase = result;

          // is the current user assigned to the case
          this.isAssignee = (result.assigned_to_id === this.userId) ? true : false;

          // get the safe search results for the header
          this.bendroSafe.search(result.rsi_handle).subscribe((search) => {
            if (!(search instanceof HttpErrorResponse)) {
              this.searchResult = search;
              this.initialDataLoaded = true;
            }
            // if an event is sent dismiss it
            if (event) {
              event.target.complete();
            }
            this.loadingIndicator.dismiss();
          });
        } else {
          // if we get out here route away
          // await Toast.show({
          //   text: 'Case not found or you do not have access to it!'
          // });

          // NOTE: Not sure this is needed but hey extra caution isn't a bad thing
          if (this.hasReaderRights) {
            this.router.navigateByUrl('/ben-sec');
          } else {
            this.router.navigateByUrl('/dashboard');
          }
          // if an event is sent dismiss it
          if (event) {
            event.target.complete();
          }
          this.loadingIndicator.dismiss();
        }
      });
    }
  }

  async addIncidentReport() {
    const modal = await this.modalController.create({
      component: AddUpdateIncidentReportComponent,
      componentProps: {
        passedHandle: this.intelligenceCase.rsi_handle
      }
    });
    await modal.present();
  }

  async createIntelCaseComment() {
    if (this.intelligenceCase && this.intelligenceCase.id) {
      const modal = await this.modalController.create({
        component: AddUpdateIntelCaseCommentComponent,
        componentProps: {
          caseId: this.intelligenceCase.id
        }
      });
      await modal.present();
    }
  }

  async updateIntelCase() {
    if (this.intelligenceCase && this.intelligenceCase.id) {
      const modal = await this.modalController.create({
        component: AddUpdateIntelReportComponent,
        componentProps: {
          intelligenceCase: this.intelligenceCase
        }
      });
      await modal.present();
    }
  }

  openIncidentList() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      // state: {
      //   incidentReports: this.intelligenceCase.incident_reports
      // }
    };

    this.router.navigate(['incidents'], navigationExtras);
  }

  fetchDescriptors() {
    // classification levels
    // danger levels
    this.fieldService
    .getFieldMulti(['30d7b3b6-4c61-4b9b-b659-632a220e6558', '6ff87667-f29f-4480-a279-0a4b5e849ed2'])
    .subscribe((result) => {
      if (!(result instanceof HttpErrorResponse)) {
        this.threatLevels = result.filter(x => x.field_id === '30d7b3b6-4c61-4b9b-b659-632a220e6558');
        this.classifications = result.filter(x => x.field_id === '6ff87667-f29f-4480-a279-0a4b5e849ed2');
      }
    });

    this.intelService.fetchAvailableOfficers().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.availableOfficers = results;
      }
    });
  }

  async ngOnInit() {
    // init user stuff
    this.userId = (await this.authService.retrieveUserSession()).id;
    this.hasReaderRights = await this.authService.hasClaim(53);
    this.hasWriterRights = await this.authService.hasClaim(54);
    this.hasAdminRights = await this.authService.hasClaim(55);

    // case id
    this.caseId = this.route.snapshot.paramMap.get('case_id'); // .split('-')[1];

    // case var exists
    if (!this.caseId) {
      await Toast.show({
        text: 'Error: Case id missing!'
      });
    }

    // reader access check
    if (!this.hasReaderRights) {
      await Toast.show({
        text: 'You do not have access to view this page!'
      });
      this.router.navigateByUrl('/dashboard');
    }

    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    this.fetchDescriptors();

    this.fetchCase();
  }

  ngOnDestroy() {
    if (this.caseSubscription) {
      this.caseSubscription.unsubscribe();
    }

    if (this.incidentSubscription) {
      this.incidentSubscription.unsubscribe();
    }
  }

}
