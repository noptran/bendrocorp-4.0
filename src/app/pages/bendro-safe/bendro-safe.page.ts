import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Modals, Toast } from '@capacitor/core';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { BendroSafeSearchResultComponent } from 'src/app/components/bendro-safe/bendro-safe-search-result/bendro-safe-search-result.component';
import { IncidentReport } from 'src/app/models/intel.model';
import { Offender, OffenderReport } from 'src/app/models/offender.model';
import { BendroSafeSearchResult } from 'src/app/models/safe-search-result';
import { BendroSafeService } from 'src/app/services/bendro-safe.service';
import { IncidentService } from 'src/app/services/incident-service.service';
import { OffenderService } from 'src/app/services/offender.service';

@Component({
  selector: 'app-bendro-safe',
  templateUrl: './bendro-safe.page.html',
  styleUrls: ['./bendro-safe.page.scss'],
})
export class BendroSafePage implements OnInit, OnDestroy {
  userId: number;
  myReports: IncidentReport[] = [];
  incidentSubscription: Subscription;
  initialDataLoaded = false;
  loadingIndicator: any;
  isAdmin: boolean;

  // safe search
  searchHandle: string;
  bendroSearchRunning = false;
  bendroSearchResult: BendroSafeSearchResult;

  constructor(
    private offenderService: OffenderService,
    private authService: AuthService,
    private router: Router,
    private nav: NavController,
    private modalController: ModalController,
    private loading: LoadingController,
    private route: ActivatedRoute,
    private bendroSafe: BendroSafeService,
    private incidentService: IncidentService
  ) {
    this.incidentSubscription = this.incidentService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchMyIncidentReports();
    });
  }

  async goSearch(event?: any) {
    console.log(event);

    if (this.searchHandle) {
      // show the ticker
      this.loadingIndicator = await this.loading.create({
        message: 'Searching'
      });
      await this.loadingIndicator.present();

      //
      this.bendroSearchRunning = true;
      this.bendroSafe.search(this.searchHandle).subscribe(async (result) => {
        if (!(result instanceof HttpErrorResponse)) {
          console.log(result);
          this.bendroSearchResult = result;

          if (result && result.rsi_data.rsi_code == 200) {
            const modal = await this.modalController.create({
              component: BendroSafeSearchResultComponent,
              componentProps: {
                searchResult: result
              }
            });
            await modal.present();
          } else {
            await Toast.show({text: `No data found for ${this.searchHandle}`});
          }
        }

        this.bendroSearchRunning = false;
        await this.loadingIndicator.dismiss();
      });
    }
  }

  doRefresh(event?: any) {
    this.fetchMyIncidentReports(event);
  }

  fetchMyIncidentReports(event?: any) {
    this.incidentService.listMyReports().subscribe(async (results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.myReports = results.filter(x => x.created_by_id === this.userId);
        this.initialDataLoaded = true;
      }

      // dismiss ticket
      if (this.loadingIndicator) {
        await this.loadingIndicator.dismiss();
      }

      // if an event was passed, complete it
      if (event) {
        event.target.complete();
      }
    });
  }

  async ngOnInit() {
    // get required user data
    this.userId = (await this.authService.retrieveUserSession()).id;

    // show the ticker
    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    // fetch current users reports
    this.fetchMyIncidentReports();
  }

  ngOnDestroy() {
    if (this.incidentSubscription) {
      this.incidentSubscription.unsubscribe();
    }
  }

}
