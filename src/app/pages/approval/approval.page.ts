import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { MyApproval } from 'src/app/models/approval.model';
import { RequestsService } from 'src/app/services/requests.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.page.html',
  styleUrls: ['./approval.page.scss'],
})
export class ApprovalPage implements OnInit {

  myApprovals: MyApproval[] = [];
  dataLoadSkip = 0;
  dataLoadTake = 15;
  baseIncrease = 15;
  totalApprovalCount: number;
  initialDataLoaded: boolean;
  loadingIndicator: any;
  currentUserId: number;

  userServiceSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private requestService: RequestsService,
    private nav: NavController,
    private loading: LoadingController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userServiceSubscription = this.userService.approvalsDataRefreshAnnounced$.subscribe(() => {
      this.fetchApprovalRange(this.dataLoadTake, this.dataLoadSkip);
    });
  }

  loadData(event) {
    // do the increases
    this.dataLoadSkip = this.dataLoadTake + this.dataLoadSkip; // skip the previous number that we took
    this.dataLoadTake = this.dataLoadTake + this.baseIncrease;

    console.log(event);
    console.log(`Take: ${this.dataLoadTake}, Skip: ${this.dataLoadSkip}`);

    // fetch
    this.fetchApprovalRange(this.dataLoadTake, this.dataLoadSkip, event);
  }

  fetchApprovalRange(count: number, skip?: number, event?: any) {
    this.requestService.list_approvals(count, skip).subscribe(async (results) => {
      if (!(results instanceof HttpErrorResponse)) {
        // hmmm...
        this.myApprovals = this.myApprovals.concat(results);
      }

      if (!this.initialDataLoaded) {
        this.initialDataLoaded = true;
        await this.loadingIndicator.dismiss();
      }

      if (event) {
        event.target.complete();

        if (this.myApprovals.length === this.totalApprovalCount) {
          event.target.disabled = true;
        }
      }
    });
  }

  openEvent(approval: MyApproval) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        character: approval
      }
    };

    this.router.navigate([approval.id]);
  }

  doRefresh(event: any) {
    // reset everything
    this.dataLoadSkip = 0;
    this.dataLoadTake = 15;
    this.baseIncrease = 15;

    // refresh data
    this.requestService.list_approvals(15).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.myApprovals = results;
      }

      if (event) {
        event.target.complete();
      }
    });
  }

  async ngOnInit() {
    this.currentUserId = (await this.authService.retrieveUserSession()).id;

    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    this.userService.fetchTotalApprovalCount().subscribe((results) => {
      if (!isNaN(results)) {
        this.totalApprovalCount = results;

        // initial data load
        this.fetchApprovalRange(this.dataLoadTake);
      }
    });
  }

}
