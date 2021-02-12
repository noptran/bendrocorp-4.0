import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Report, ReportRoute, ReportTemplate } from 'src/app/models/report.model';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-add-update-form',
  templateUrl: './add-update-form.component.html',
  styleUrls: ['./add-update-form.component.scss'],
})
export class AddUpdateFormComponent implements OnInit {
  @Input() report: Report;
  initialDataLoaded: boolean; // not sure we will use this - we want forms to be fast
  formAction: string;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;
  dataSubmitted: boolean;

  // type arrays
  reportTemplates: ReportTemplate[] = [];
  reportRoutes: ReportRoute[] = [];

  constructor(
    private reportService: ReportService,
    private loading: LoadingController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  /**
   * Fetch the required type and information needed to submit a form
   */
  fetchTypes() {
    this.reportService.listTemplates().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.reportTemplates = results.filter(x => !x.draft);
      }
    });

    this.reportService.listReportRoutes().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.reportRoutes = results;
      }
    });
  }

  templateChange(event: any) {
    this.report.template_id = event.value.id;
  }

  createValid(): boolean {
    //
    if (this.report && this.report.template_id) {
      return true;
    } else {
      return false;
    }
  }

  submitValid(): boolean {
    return false;
  }

  /**
   * This will create the initial report object after a template is selected.
   */
  async createReport() {
    if (this.report && !this.report.id) {
      // disable button
      this.dataSubmitted = true;

      // creating indicator
      this.loadingIndicator = await this.loading.create({
        message: 'Creating'
      });
      await this.loadingIndicator.present();

      // send the request
      this.reportService.createReport(this.report).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          // dont drop the window, just replace the object
          this.report = results;

          // signal to update reports
          this.reportService.refreshReportsData();

          // nav to the details
          const navigationExtras: NavigationExtras = {
            relativeTo: this.route,
            state: {
              report: this.report
            }
          };
          this.router.navigate(['forms', this.report.id], navigationExtras);

          // dismiss the modal
          this.dismiss();
        } else {
          this.dataSubmitted = false;
        }

        // dismiss the indicator
        if (this.loadingIndicator) {
          this.loading.dismiss();
        }
      });
    }
  }

  /**
   * This will submit a report for final review
   */
  submitReport() {

  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    this.fetchTypes();

    if (this.report && this.report.id) {
      this.formAction = 'Submit';
    } else {
      this.formAction = 'Create';
      this.report = {} as Report;
    }
  }

}
