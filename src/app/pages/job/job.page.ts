import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { AddUpdateJobComponent } from 'src/app/components/jobs/add-update-job/add-update-job.component';
import { JobBoardMission } from 'src/app/models/job-board.model';
import { JobBoardService } from 'src/app/services/job-board.service';
import { Plugins } from '@capacitor/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

const { Modals } = Plugins;

@Component({
  selector: 'app-job',
  templateUrl: './job.page.html',
  styleUrls: ['./job.page.scss'],
})
export class JobPage implements OnInit, OnDestroy {

  //
  jobs: JobBoardMission[] = [];
  jobSubscription: Subscription;

  //
  isAdmin: boolean;
  initialDataLoad: boolean;

  //
  loadingIndicator: any;

  constructor(
    private jobBoardService: JobBoardService,
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private loading: LoadingController) {
    this.jobSubscription = this.jobBoardService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchJobs();
    });
  }

  doRefresh(event: any) {
    this.fetchJobs(event);
  }

  openJob(job: JobBoardMission) {
    try {
      const navigationExtras: NavigationExtras = {
        relativeTo: this.route,
        state: {
          character: job
        }
      };

      this.router.navigate([job.id], navigationExtras);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addUpdateJob(passedJob?: JobBoardMission) {
    console.log(passedJob);
    const modal = await this.modalController.create({
      component: AddUpdateJobComponent,
      componentProps: {
        job: passedJob
      }
    });
    return await modal.present();
  }

  fetchJobs(event?: any) {
    this.jobBoardService.list().subscribe(async (results) => {
      if (!(results instanceof HttpErrorResponse)) {
        if (this.isAdmin) {
          this.jobs = results;
        } else {
          this.jobs = results.filter(x => x.mission_status_id < 3);
        }

        this.initialDataLoad = true;
        await this.loadingIndicator.dismiss();
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  async archiveJob(job: JobBoardMission) {
    if (job && job.id) {
      // const result = await this.messageService.confirmation();
      // console.log(result);
      // console.error('Archive not fully implemented! Do that :)');

      // const confirmRet = await Modals.confirm({
      //   title: 'Confirm',
      //   message: `Are you sure you want to archive '${job.title}'?`
      // });

      // if (confirmRet.value) {
      //   this.jobBoardService.
      // }
    }
  }

  ionViewWillEnter() {
    this.fetchJobs();
  }

  ionViewDidLeave() {
  }

  async ngOnInit() {
    this.isAdmin = await this.authService.hasClaim(28);

    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    this.fetchJobs();
  }

  ngOnDestroy() {
    if (this.jobSubscription) {
      this.jobSubscription.unsubscribe();
    }
  }

}
