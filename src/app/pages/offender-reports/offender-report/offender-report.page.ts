import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { OffenderReport } from 'src/app/models/offender.model';
import { OffenderService } from 'src/app/services/offender.service';
import { Plugins } from '@capacitor/core';

const { Toast } = Plugins;

@Component({
  selector: 'app-offender-report',
  templateUrl: './offender-report.page.html',
  styleUrls: ['./offender-report.page.scss'],
})
export class OffenderReportPage implements OnInit {

  reports: OffenderReport[];
  reportListKind: 'mine'|'unanswered'|'all';

  constructor(
    private offenderService: OffenderService,
    private router: Router,
    private route: ActivatedRoute,
    private navController: NavController
  ) { }

  openReport(report: OffenderReport) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        report
      }
    };

    this.router.navigateByUrl(`/offender-reports/${report.offender_id}/report/${report.id}`, navigationExtras);
  }

  async ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      console.log(this.router.getCurrentNavigation().extras.state);

      this.reports = this.router.getCurrentNavigation().extras.state.reports;
      this.reports.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      console.log(this.reports);
    } else {
      await Toast.show({
        text: 'Report types not selected!'
      });
      this.router.navigateByUrl('/offender-reports');
    }
  }
}
