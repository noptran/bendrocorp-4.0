import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '@capacitor/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { TimeSpan } from 'ng-timespan';
import { AuthService } from 'src/app/auth.service';
import { CertifyEventComponent } from 'src/app/components/events/certify-event/certify-event.component';
import { EventAddUpdateComponent } from 'src/app/components/events/event-add-update/event-add-update.component';
import { Event } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {
  @Input() event: Event;
  eventId: number;
  userId: number;
  openedAsModal = false;
  isAdmin: boolean;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;

  constructor(
    private eventService: EventService,
    private modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingController,
    private authService: AuthService
  ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.event = this.router.getCurrentNavigation().extras.state.event;
      console.log('details transferred');
      console.log(this.event);
    }
  }

  openEventDetailsPage()
  {
    if (this.event) {
      this.router.navigate(['events', this.event.id]);
      this.openedAsModal = false;
      this.dismiss();
    }
  }

  doRefresh(event: any) {
    this.getEvent(event);
  }

  async addUpdateEvent() {
    const modal = await this.modalController.create({
      component: EventAddUpdateComponent,
      componentProps: {
        event: this.event
      }
    });
    return await modal.present();
  }

  checkCurrentStatus(): number {
    if (this.event && this.event.attendences) {
      const status = this.event.attendences.find(x => x.user_id === this.userId)?.attendence_type_id;
      return status;
    }
  }

  fetchAttendanceString() {
    if (this.event) {
      if (this.event.attendences && this.event.attendences.filter(x => x.attendence_type_id === 1).length > 0) {
        return this.event.attendences.filter(x => x.attendence_type_id === 1).map(val => val.character.full_name).join(', ');
      } else {
        return 'None';
      }
    }
  }

  isExpired() {
    if (this.event) {
      const ts = TimeSpan.Subtract(new Date(), new Date(this.event.end_date));
      return (ts.totalSeconds < 0) ? true : false;
    } else {
      return false;
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

  setAttendance(typeId: number) {
    if (this.event) {
      if (typeId === 1 || typeId === 2) {
        this.eventService.setAttendence(this.event.id, typeId).subscribe(
          (result) => {
            if (!(result instanceof HttpErrorResponse)) {
              if (this.event.attendences.find(x => x.id === result.id)) {
                this.event.attendences[this.event.attendences.findIndex(x => x.id === result.id)] = result;
              } else {
                this.event.attendences.push(result);
              }
              this.eventService.refreshData();
            }
          }
        );
      } else {
        console.error(`Provided attendence type ${typeId} out of accepted range!`);
        Toast.show({
          text: `Provided attendence type ${typeId} out of accepted range!`
        });
        // this.messageService.alert('Something went wrong. Please try again later!');
      }
    }
  }

  async certifyEvent() {
    if (this.isAdmin) {
      const modal = await this.modalController.create({
        component: CertifyEventComponent,
        componentProps: {
          event: this.event
        }
      });
      return await modal.present();
    }
  }

  getEvent(event?: any) {
    if (this.eventId) {
      this.eventService.fetch(this.eventId).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.event = results;

          if (event) {
            event.target.complete();
          }

          if (this.loadingIndicator) {
            this.loadingIndicator.dismiss();
          }
        }
      });
    }
  }

  async ngOnInit() {
    this.eventId = parseInt(this.route.snapshot.paramMap.get('id'), null);
    this.userId = (await this.authService.retrieveUserSession()).id;
    this.isAdmin = await this.authService.hasClaim(19);

    // if the event is not loaded (ie we came to this page directly) then load it
    if (!this.event) {
      this.loadingIndicator = await this.loading.create({
        message: 'Loading'
      });
      await this.loadingIndicator.present();

      this.getEvent();
    }
  }

}
