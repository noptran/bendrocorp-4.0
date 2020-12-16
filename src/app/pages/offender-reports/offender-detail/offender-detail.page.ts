import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { Offender, OffenderReport } from 'src/app/models/offender.model';
import { OffenderService } from 'src/app/services/offender.service';

@Component({
  selector: 'app-offender-detail',
  templateUrl: './offender-detail.page.html',
  styleUrls: ['./offender-detail.page.scss'],
})
export class OffenderDetailPage implements OnInit, OnDestroy {
  offenderId: number;
  offender: Offender;
  offenderSubscription: Subscription;
  loadingIndicator: any;
  offenderInfractionHistogram: { };

  constructor(
    private navController: NavController,
    private offenderService: OffenderService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private loading: LoadingController
  ) {
    this.offenderSubscription = this.offenderService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchOffender();
    });
  }

  openReport(report: OffenderReport) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        report
      }
    };

    this.router.navigate(['report', report.id], navigationExtras);
  }

  fetchOffender() {
    this.offenderService.fetch_offender(this.offenderId).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.offender = results;

        // histogram the infractions

        let infractionsHistogram = { };
        this.offender.offender_reports
        .map(x => x.infractions)
        .reduce((acc, val) => acc.concat(val), [])
        .map(x => x.title).forEach((title) => {
          if (infractionsHistogram[title]) {
            infractionsHistogram[title] += 1;
          } else {
            infractionsHistogram[title] = 1;
          }
        });

        this.offenderInfractionHistogram = infractionsHistogram;

        if (this.loadingIndicator) {
          this.loadingIndicator.dismiss();
        }
      }
    });
  }

  fetchOrgAssociatesString() {
    if (this.offender && this.offender.id && this.offender.offender_report_org) {
      const filtered = this.offender.offender_report_org.known_offenders.filter(x => x.id !== this.offender.id).map(x => x.offender_handle);
      return (filtered.length > 0) ? filtered.join(', ') : 'None';
    } else {
      return 'None';
    }
  }

  async ngOnInit() {
    if (this.route.snapshot.paramMap.get('offenderId')) {
      this.offenderId = parseInt(this.route.snapshot.paramMap.get('offenderId'), null);
    }

    if (this.router.getCurrentNavigation()?.extras.state?.offender) {
      console.log('offender found');

      this.offender = this.router.getCurrentNavigation().extras.state.offender;
      console.log(this.offender);
    } else {
      console.log('need to fetch offender');
      this.loadingIndicator = await this.loading.create({
        message: 'Loading'
      });
      await this.loadingIndicator.present();
      this.fetchOffender();
    }
  }

  ngOnDestroy() {
    if (this.offenderSubscription) {
      this.offenderSubscription.unsubscribe();
    }
  }
}
