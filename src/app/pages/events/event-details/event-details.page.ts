import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { TimeSpan } from 'ng-timespan';
import { AuthService } from 'src/app/auth.service';
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
  openedAsModal = false;

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
    if (this.router.getCurrentNavigation().extras.state) {
      this.event = this.router.getCurrentNavigation().extras.state.event;
      console.log('details transferred');
      console.log(this.event);
    }
  }

  // openEventDetailsPage()
  // {
  //   if (this.event) {
  //     this.router.navigate(['events', this.event.id]);
  //     // this.router.navigateByUrl(`/events`);
  //     // this.router.navigateByUrl(`/events/${this.event.id}`);
  //     this.openedAsModal = false;
  //     this.dismiss();
  //   }
  // }

  async checkCurrentStatus() {
    if (this.event && this.event.attendences) {
      const id = (await this.authService.retrieveUserSession()).id;
      return this.event.attendences.find(x => x.user_id === id);
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

  getEvent() {
    if (this.eventId) {
      this.eventService.fetch(this.eventId).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.event = results;
          this.loading.dismiss();
        }
      });
    }
  }

  async ngOnInit() {
    this.eventId = parseInt(this.route.snapshot.paramMap.get('id'), null);

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
