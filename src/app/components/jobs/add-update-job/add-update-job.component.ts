import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { JobBoardMission, JobBoardMissionCompletionCriteria } from 'src/app/models/job-board.model';
import { JobBoardService } from 'src/app/services/job-board.service';

@Component({
  selector: 'app-add-update-job',
  templateUrl: './add-update-job.component.html',
  styleUrls: ['./add-update-job.component.scss'],
})
export class AddUpdateJobComponent implements OnInit {

  formAction: string;
  job: JobBoardMission;
  criteria: JobBoardMissionCompletionCriteria[];
  dataSubmitted: boolean;

  constructor(private jobBoardService: JobBoardService, private modalController: ModalController) { }

  addUpdateJob() {
    if (this.job && this.job.id) {
      this.jobBoardService.update(this.job).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.jobBoardService.refreshData();
          this.dismiss();
        }
      });
    } else {
      this.jobBoardService.create(this.job).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.jobBoardService.refreshData();
          this.dismiss();
        }
      });
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

  fetchCriteria() {
    this.jobBoardService.list_criteria().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.criteria = results;
        console.log(results);
      }
    });
  }

  ngOnInit() {
    this.fetchCriteria();

    if (this.job && this.job.id) {
      console.log(this.job);
      this.formAction = 'Update';
    } else {
      this.formAction = 'Create';
      console.log('Job not passed to modal. Assuming create!');
      this.job = {} as JobBoardMission;
    }
  }
}
