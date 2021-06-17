import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { AddUpdateOffenderReportComponent } from 'src/app/components/offender-reports/add-update-offender-report/add-update-offender-report.component';
import { Offender, OffenderReport } from 'src/app/models/offender.model';
import { OffenderService } from 'src/app/services/offender.service';
import { Plugins } from '@capacitor/core';
import { BendroSafeService } from 'src/app/services/bendro-safe.service';
import { BendroSafeSearchResult } from 'src/app/models/safe-search-result';
import { BendroSafeSearchResultComponent } from 'src/app/components/bendro-safe/bendro-safe-search-result/bendro-safe-search-result.component';

const { Modals, Toast } = Plugins;

@Component({
  selector: 'app-offender-reports',
  templateUrl: './offender-reports.page.html',
  styleUrls: ['./offender-reports.page.scss'],
})
export class OffenderReportsPage implements OnInit, OnDestroy {
  userId: number;

  offenders: Offender[];
  myReports: OffenderReport[] = [];
  unAnsweredReports: OffenderReport[] = [];
  adminReports: OffenderReport[] = [];
  offenderSubscription: Subscription;
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
  ) { }

  openOffenderDetails(offender: Offender) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        offender
      }
    };

    this.router.navigate([offender.id], navigationExtras);
  }

  openReportList(reports: OffenderReport[], reportListKind: 'admin'|'mine'|'unanswered'|'all') {
    // no reports guard
    if ((reportListKind === 'mine' || reportListKind === 'unanswered') && reports.length === 0) {
      if (reportListKind === 'mine') {
        Modals.alert({
          title: 'No reports',
          message: 'You currently do not have any offender reports!'
        });
      } else if (reportListKind === 'unanswered') {
        Modals.alert({
          title: 'No reports',
          message: 'There are no unanswered reports!'
        });
      }

      // exit
      return;
    }

    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        reports
      }
    };

    this.router.navigate(['reports'], navigationExtras);
  }

  // doRefresh(event: any) {
  //   this.fetchOffenders(event);
  // }

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

  // async fetchOffenders(event?: any) {
  //   this.offenderService.list().subscribe(async (results) => {
  //     if (!(results instanceof HttpErrorResponse)) {
  //       this.offenders = results.sort((a, b) => a.offender_handle.localeCompare(b.offender_handle));
  //       console.log(this.offenders);
  //     }

  //     if (!this.initialDataLoaded) {
  //       this.initialDataLoaded = true;
  //       await this.loading.dismiss();
  //     }

  //     if (event) {
  //       event.target.complete();
  //     }
  //   });
  // }

  // async fetchOffenderReports() {

  //   if (this.isAdmin) {
  //     // then get all of the reports
  //     this.offenderService.list_admin().subscribe((results) => {
  //       if (!(results instanceof HttpErrorResponse)) {
  //         this.adminReports = results;
  //         this.unAnsweredReports = results.filter(x => !x.report_approved && x.submitted_for_approval);
  //         this.myReports = results.filter(x => x.created_by_id === this.userId);
  //       }
  //     });
  //   } else {
  //     this.offenderService.list_mine().subscribe((results) => {
  //       if (!(results instanceof HttpErrorResponse)) {
  //         this.myReports = results;
  //       }
  //     });
  //   }
  // }

  // async addOffenderReport(event?: Event) {
  //   const modal = await this.modalController.create({
  //     component: AddUpdateOffenderReportComponent
  //   });
  //   return await modal.present();
  // }

  async ngOnInit() {
    // get required user data
    this.userId = (await this.authService.retrieveUserSession()).id;
    this.isAdmin = await this.authService.hasClaim(16);

    // this.loadingIndicator = await this.loading.create({
    //   message: 'Loading'
    // });
    // await this.loadingIndicator.present();

    // fetch the data
    // this.fetchOffenders();
    // this.fetchOffenderReports();
    this.initialDataLoaded = true;
  }

  ngOnDestroy() {
    if (this.offenderSubscription) {
      this.offenderSubscription.unsubscribe();
    }
  }
}
