import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DonationItem } from 'src/app/models/misc.model';
import { DonationService } from 'src/app/services/donation.service';
import { Plugins } from '@capacitor/core';

const { Modals } = Plugins;

@Component({
  selector: 'app-app-update-donation-goal',
  templateUrl: './app-update-donation-goal.component.html',
  styleUrls: ['./app-update-donation-goal.component.scss'],
})
export class AppUpdateDonationGoalComponent implements OnInit {
  @Input() donationItem: DonationItem;
  formAction: string;
  dataSubmitted: boolean;

  loadingIndicator: any;

  constructor(
    private donationService: DonationService,
    private modalController: ModalController,
    private loading: LoadingController
  ) {
  }

  valid() {
    if (this.donationItem && (this.donationItem && this.donationItem.title && this.donationItem.description && this.donationItem.goal)) {
      return true;
    } else {
      return false;
    }
  }

  submitForm() {
    this.dataSubmitted = true;
    if (this.donationItem.id) {
      this.donationService.update(this.donationItem).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.donationService.refreshData();
          this.dismiss();
        } else {
          this.dataSubmitted = false;
        }
      });
    } else {
      this.donationService.create(this.donationItem).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.donationService.refreshData();
          this.dismiss();
        } else {
          this.dataSubmitted = false;
        }
      });
    }
  }

  async archive() {
    if (this.donationItem.id) {
      const confirmRet = await Modals.confirm({
        title: 'Confirm',
        message: 'Are you sure you want to archive this donation item?'
      });

      if (confirmRet.value) {
        this.donationService.archive(this.donationItem).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.donationService.refreshData();
            this.dismiss();
          }
        });
      }
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    if (this.donationItem && this.donationItem.id) {
      this.formAction = 'Update';
    } else {
      this.formAction = 'Create';
    }

    if (!(this.donationItem && this.donationItem.id)) {
      this.donationItem = {} as DonationItem;
    }
  }

}
