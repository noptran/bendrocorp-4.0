import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Donation, DonationItem } from 'src/app/models/misc.model';
import { DonationService } from 'src/app/services/donation.service';
import { PaymentProviderService } from 'src/app/services/payment-provider.service';
import { Plugins } from '@capacitor/core';
import { HttpErrorResponse } from '@angular/common/http';

const { Toast } = Plugins;

@Component({
  selector: 'app-make-donation',
  templateUrl: './make-donation.component.html',
  styleUrls: ['./make-donation.component.scss'],
})
export class MakeDonationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() donationItem: DonationItem;
  @ViewChild('cardElement', { static: true }) cardElement: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  donationInProgress = false;
  donationAmount: number;
  submissionError = '';

  constructor(
    private donationService: DonationService,
    private cd: ChangeDetectorRef,
    private pp: PaymentProviderService,
    private modalController: ModalController
  ) { }

  async submitDonation() {
    if (this.donationAmount >= 1 && this.isInt(this.donationAmount)) {
      this.donationInProgress = true;
      const { source, error }  = await this.pp.stripe.createSource(this.card);

      // To test: 4242 4242 4242 4242 - with any expiration date in the future, any 3-digit number for the CVC and any valid zip code.
      if (error) {
        console.error('Stripe validation failed: ', error);
        Toast.show({
          text: error.message
        });
        // this.messageService.addError(error.message)
        this.donationInProgress = false;
      } else {
        console.log('Success!', source);
        console.log('Source ID ' + source.id);

        this.donationService.donate({
          amount: this.donationAmount,
          donation_item_id:
          this.donationItem.id,
          card_token: source.id } as Donation)
          .subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              // this.messageService.addSuccess("Donation Successful!")
              this.donationService.refreshData();
              this.dismiss();
            } else {
              this.donationInProgress = false;
            }
          }
        );
      }
    } else {
      Toast.show({
        text: 'Invalid donation entry. Donation must be greate than $1 and be a whole dollar. (ie. $1, $2, etc not $1.01'
      });
    }
  }

  valid() {
    if ((this.error == null || this.error === undefined)
    && this.donationAmount && this.donationAmount >= 1 && this.isInt(this.donationAmount)) {
      return true;
    } else {
      return false;
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  private isInt(n) {
    return n % 1 === 0;
  }

  ngOnInit() {}

  ngAfterViewInit()
  {
    this.card = this.pp.elements.create('card');
    this.card.mount(this.cardElement.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

}
