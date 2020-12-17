import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TimeSpan } from 'ng-timespan';
import { AuthService } from 'src/app/auth.service';
import { CompleteJobComponent } from 'src/app/components/jobs/complete-job/complete-job.component';
import { JobBoardMission } from 'src/app/models/job-board.model';
import { JobBoardService } from 'src/app/services/job-board.service';

import { Plugins } from '@capacitor/core';
import { NgModel } from '@angular/forms';
import { relativeTimeThreshold } from 'moment';

const { Modals } = Plugins;
const { Toast } = Plugins;

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.page.html',
  styleUrls: ['./job-details.page.scss'],
})
export class JobDetailsPage implements OnInit {
  userId: number;
  eventId: number;
  job: JobBoardMission;

  constructor(
    private authService: AuthService,
    private jobBoardService: JobBoardService,
    // private messageService: MessageService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private router: Router
  ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.job = this.router.getCurrentNavigation().extras.state.job;
    }
  }

  parseInt(num: any): number {
    return parseInt(num, null);
  }

  fetchJob(event?: any) {
    if (!this.job && this.eventId) {
      this.jobBoardService.fetch(this.eventId).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.job = results;
        } else {
          Modals.alert({
            title: 'Data Error',
            message: 'Event not properly passed to event detail view!'
          });
        }

        if (event) {
          event.target.complete();
        }
      });
    } else if (this.job && !this.eventId) {
      console.log('Job loaded');
      console.log(this.job);

      if (event) {
        event.target.complete();
      }

      return;
    }
  }

  async completeJob() {
    if (this.job) {
      this.jobBoardService.setPassData(this.job);
      const modal = await this.modalController.create({
        component: CompleteJobComponent
      });
      return await modal.present();
    }
  }

  isExpired() {
    if (this.job && this.job.expires_when) {
      const ts = TimeSpan.Subtract(new Date(), new Date(this.job.expires_when));
      return (ts.totalSeconds < 0) ? true : false;
    } else {
      return false;
    }
  }

  isAcceptor(): boolean {
    if (this.job) {
      return (this.job.on_mission.find(x => x.user_id === this.userId)) ? true : false;
    }
  }

  fetchAcceptors(): string {
    if (this.job) {
      if (this.job.on_mission.length > 0) {
        return this.job.on_mission.map(x => x.first_name).join(', ');
      } else {
        return 'None';
      }
    }
  }

  async acceptMission() {
    const confirmRet = await Modals.confirm({
      title: 'Confirm',
      message: 'Are you sure you want to accept this mission?'
    });

    if (confirmRet.value) {
      const accepted = this.isAcceptor();
      if (!accepted && (!this.job.on_mission || (this.job.max_acceptors <= this.job.on_mission.length + 1))) {
        this.jobBoardService.accept(this.job.id).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.job = results;
              this.jobBoardService.refreshData();
            }
          }
        );
      } else {
        Modals.alert({
          title: 'Already Accepted',
          message: 'You have already accepted this mission!'
        });
      }
    }
  }

  async abandonMission() {
    const confirmRet = await Modals.confirm({
      title: 'Confirm',
      message: 'Are you sure you want to abandon this mission?'
    });
    if (confirmRet.value) {
      if (this.isAcceptor()) {
        this.jobBoardService.abandon(this.job.id).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.job = results;
              this.jobBoardService.refreshData();
            }
          }
        );
      } else {
        Modals.alert({
          title: 'Already Accepted',
          message: 'You have not accepted this mission!'
        });
      }
    }
  }

  doRefresh(event: any) {
    this.fetchJob(event);
  }

  async ngOnInit() {
    this.userId = (await this.authService.retrieveUserSession()).id;
    if (this.route.snapshot.paramMap.get('id')) {
      this.eventId = parseInt(this.route.snapshot.paramMap.get('id'), null);
    }

    if (!this.job) {
      this.fetchJob();
    }

    this.fetchJob();
  }

}
