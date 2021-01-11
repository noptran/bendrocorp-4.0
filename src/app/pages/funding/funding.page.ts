import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { AppUpdateDonationGoalComponent } from 'src/app/components/donations/app-update-donation-goal/app-update-donation-goal.component';
import { JoinSupporterComponent } from 'src/app/components/donations/join-supporter/join-supporter.component';
import { MakeDonationComponent } from 'src/app/components/donations/make-donation/make-donation.component';
import { Donation, DonationItem } from 'src/app/models/misc.model';
import { DonationService } from 'src/app/services/donation.service';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.page.html',
  styleUrls: ['./funding.page.scss'],
})
export class FundingPage implements OnInit, OnDestroy {
  initialDataLoad = true;
  isNativeiOS: boolean; // cause Apple sucks and I dont want to try to implement their stuff at the moment

  userDonations: Donation[] = [];
  donationItems: DonationItem[] = [];
  isAdmin: boolean;
  subscription: Subscription;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;

  constructor(
    private authService: AuthService,
    private donationService: DonationService,
    private loading: LoadingController,
    private modalController: ModalController,
    private platform: Platform
  ) {
    this.subscription = this.donationService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchDonationItems();
      this.fetchUserDonations();
    });
  }

  fetchDonationItems(event?: any) {
    this.donationService.list().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.donationItems = results;

        if (this.loadingIndicator) {
          this.loading.dismiss();
        }
      }

      if (event) {
        event.target.complete();
      }
    });
  }

  fetchUserDonations(event?: any)
  {
    this.donationService.list_mine().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.userDonations = results.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
        }

        if (event) {
          event.target.complete();
        }
      }
    );
  }

  doRefresh(event: any) {
    this.fetchDonationItems();
    this.fetchUserDonations();
  }

  itemWidth(item: DonationItem)
  {
    const width = (item.total_donations * 100) / item.goal;
    return width;
  }

  async addUpdateDonationItem(item?: DonationItem) {
    const modal = await this.modalController.create({
      component: AppUpdateDonationGoalComponent,
      componentProps: {
        donationItem: item
      }
    });
    return await modal.present();
  }

  async makeDonation(item: DonationItem) {
    const modal = await this.modalController.create({
      component: MakeDonationComponent,
      componentProps: {
        donationItem: item
      }
    });
    return await modal.present();
  }

  async becomeSupporter() {
    const modal = await this.modalController.create({
      component: JoinSupporterComponent
    });
    return await modal.present();
  }

  async ngOnInit() {
    this.isNativeiOS = this.platform.is('capacitor') && this.platform.is('ios');

    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    this.isAdmin = await this.authService.hasClaim(2);
    this.fetchDonationItems();
    this.fetchUserDonations();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
