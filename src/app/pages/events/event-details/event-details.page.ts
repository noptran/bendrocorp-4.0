import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Event } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {
  event: Event;
  openedAsModal = false;
  constructor(
    private eventService: EventService,
    private modalController: ModalController,
    private router: Router
  ) { }

  openEventDetailsPage()
  {
    if (this.event) {
      this.router.navigate(['events', this.event.id]);
      // this.router.navigateByUrl(`/events`);
      // this.router.navigateByUrl(`/events/${this.event.id}`);
      this.openedAsModal = false;
      this.dismiss();
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  ngOnInit() {
  }

}
