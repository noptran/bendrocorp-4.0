import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { AddUpdateOffenderReportComponent } from 'src/app/componenents/offender-reports/add-update-offender-report/add-update-offender-report.component';
import { OffenderReport } from 'src/app/models/offender.model';
import { OffenderService } from 'src/app/services/offender.service';

@Component({
  selector: 'app-offender-report-detail',
  templateUrl: './offender-report-detail.page.html',
  styleUrls: ['./offender-report-detail.page.scss'],
})
export class OffenderReportDetailPage implements OnInit {

  userId: number;
  report: OffenderReport;
  isAdmin: boolean;
  canEdit: boolean;

  constructor(
    private offenderService: OffenderService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private navController: NavController,
    private modalController: ModalController
  ) { }

  async updateOffenderReport() {
    if (this.report && this.report.id) {
      const modal = await this.modalController.create({
        component: AddUpdateOffenderReportComponent,
        componentProps: {
          offenderReport: this.report
        }
      });
      return await modal.present();
    }
  }

  async ngOnInit() {
    this.isAdmin = await this.authService.hasClaim(16);
    this.userId = (await this.authService.retrieveUserSession()).id;

    //
    if (this.router.getCurrentNavigation()?.extras.state) {

      this.report = this.router.getCurrentNavigation().extras.state.report;
      console.log(this.report);
      if ((this.report.created_by_id === this.userId
      && !this.report.submitted_for_approval && !this.report.report_approved) || this.isAdmin) {
        this.canEdit = true;
      } else {
        this.canEdit = false;
      }
    }
  }
}
