import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { IntelligenceCaseComment } from 'src/app/models/intel.model';
import { IntelService } from 'src/app/services/intel-service.service';

import { Plugins } from '@capacitor/core';
import { HttpErrorResponse } from '@angular/common/http';
const { Toast } = Plugins;

@Component({
  selector: 'app-add-update-intel-case-comment',
  templateUrl: './add-update-intel-case-comment.component.html',
  styleUrls: ['./add-update-intel-case-comment.component.scss'],
})
export class AddUpdateIntelCaseCommentComponent implements OnInit {
  comment: IntelligenceCaseComment;
  caseId: string;
  formAction: string;
  tickerAction: string;
  dataSubmitting = false;

  loadingIndicator: any;

  constructor(
    private intelService: IntelService,
    private router: Router,
    private modalController: ModalController,
    private loading: LoadingController
  ) { }

  async addUpdateComment() {
    if (this.comment) {
      this.loadingIndicator = await this.loading.create({
        message: 'Saving case comment'
      });
      await this.loadingIndicator.present();

      this.intelService.addComment(this.comment, this.caseId).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.dismiss();
          this.intelService.refreshData();
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
    } else {
      this.formAction = 'Create';
      this.tickerAction = 'Creating';
      this.comment = { comment: '' } as IntelligenceCaseComment;
    }
  }
}
