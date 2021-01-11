import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { DonationService } from 'src/app/services/donation.service';
import { PaymentProviderService } from 'src/app/services/payment-provider.service';
import { Plugins } from '@capacitor/core';
import { HttpErrorResponse } from '@angular/common/http';

const { Toast, Modals } = Plugins;

@Component({
  selector: 'app-join-supporter',
  templateUrl: './join-supporter.component.html',
  styleUrls: ['./join-supporter.component.scss'],
})
export class JoinSupporterComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('cardElementSub', { static: false }) cardElement: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  donationInProgress = false;
  submissionError = '';
  userEmail: string;
  isSupporter: boolean;
  dataSubmitted: boolean;

  constructor(
    private donationService: DonationService,
    private cd: ChangeDetectorRef,
    private pp: PaymentProviderService,
    private modalController: ModalController,
    private authService: AuthService
  ) { }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  submitForm() {
    this.dataSubmitted = true;
    this.pp.stripe
    .createPaymentMethod({
      type: 'card',
      card: this.card,
      billing_details: {
        name: `billingName`,
      },
    })
    .then((result) => {
      if (result.error) {
        this.displayError(result);
        this.dataSubmitted = false;
      } else {
        this.donationService.createSubscription({
          paymentMethodId: result.paymentMethod.id
        }).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            Toast.show({
              text: 'Supporter Program joined!'
            });
            this.dismiss();
          } else {
            this.dataSubmitted = false;
          }
        });
      }
    });
  }

  displayError(error: string) {
    Toast.show({
        text: error
    });
  }

  cancelSubscription() {
    this.donationService.endSubscription().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        Toast.show({
          text: 'Supporter Program subscription cancelled!'
        });
        this.dismiss();
      }
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async ngOnInit() {
    this.isSupporter = (await this.authService.retrieveUserSession()).subscriber;
  }

  ngAfterViewInit() {
    this.card = this.pp.elements.create('card');
    this.card.mount(this.cardElement.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

}
