import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { IncidentReportComment } from 'src/app/models/intel.model';
import { IncidentService } from 'src/app/services/incident-service.service';
import { IntelService } from 'src/app/services/intel-service.service';

@Component({
  selector: 'app-add-update-incident-report-comment',
  templateUrl: './add-update-incident-report-comment.component.html',
  styleUrls: ['./add-update-incident-report-comment.component.scss'],
})
export class AddUpdateIncidentReportCommentComponent implements OnInit {

  comment: IncidentReportComment;
  reportId: string;
  formAction: string;
  tickerAction: string;
  dataSubmitting = false;

  loadingIndicator: any;

  constructor(
    private intelService: IntelService,
    private incidentService: IncidentService,
    private router: Router,
    private modalController: ModalController,
    private loading: LoadingController
  ) { }

  async addUpdateComment() {
    if (this.comment) {
      this.loadingIndicator = await this.loading.create({
        message: 'Saving report comment'
      });
      await this.loadingIndicator.present();

      this.incidentService.addComment(this.comment, this.reportId).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.dismiss();
          this.intelService.refreshData();
          this.incidentService.refreshData();
        }

        this.loadingIndicator.dismiss();
      });
    }
  }

  formValid() {
    if (this.comment && this.comment.comment && this.comment.comment.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    if (this.comment && this.comment.id) {
      // TODO
      this.formAction = 'erm...';
    } else {
      this.formAction = 'Create';
      this.tickerAction = 'Creating';
      this.comment = { comment: '' } as IncidentReportComment;
    }
  }

}
