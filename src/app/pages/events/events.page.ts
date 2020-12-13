import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { EventService } from 'src/app/services/event.service';
import { EventDetailsPage } from './event-details/event-details.page';
import { Event } from '../../models/event.model';
import { Plugins } from '@capacitor/core';
import { CertifyEventComponent } from 'src/app/components/events/certify-event/certify-event.component';
import { EventAddUpdateComponent } from 'src/app/components/events/event-add-update/event-add-update.component';

const { Toast } = Plugins;
const { Modals } = Plugins;

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventPage implements OnInit, OnDestroy {
  detailsNav = EventDetailsPage;
  events: Event[] = [];
  expiredEvents: Event[] = [];
  isAdmin: boolean;
  eventSubscription: Subscription;
  initialDataLoaded = false;
  loadingIndicator: any;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private router: Router,
    private nav: NavController,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private loading: LoadingController) {
    this.eventSubscription = this.eventService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchEvents();
      if (this.isAdmin) {
        this.fetchExpiredEvents();
      }
    });
  }

  doRefresh(event: any) {
    this.fetchEvents(event);
    if (this.isAdmin) {
      this.fetchExpiredEvents();
    }
  }

  fetchEvents(event?: any) {
    this.eventService.list().subscribe(async (results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.events = results;
      }

      if (!this.initialDataLoaded && !this.isAdmin) {
        this.initialDataLoaded = true;
        await this.loading.dismiss();
      }

      if (event) {
        event.target.complete();
      }
    });
  }

  async fetchExpiredEvents(event?: any) {
    this.eventService.list_expired(10).subscribe(async (results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.expiredEvents = results;
      }

      if (!this.initialDataLoaded && this.isAdmin) {
        this.initialDataLoaded = true;
        await this.loading.dismiss();
      }

      if (event) {
        event.target.complete();
      }
    });
  }

  fetchAttendenceString(event: Event) {
    return event.attendences.filter(x => x.attendence_type_id === 1).map(val => val.character.full_name).join(', ');
  }

  async certifyEvent(event: Event) {
    this.eventService.setPassData(event);
    const modal = await this.modalController.create({
      component: CertifyEventComponent
    });
    return await modal.present();
  }

  async addUpdateEvent(event?: Event) {
    if (event) {
      this.eventService.setPassData(event);
    }

    const modal = await this.modalController.create({
      component: EventAddUpdateComponent
    });
    return await modal.present();
  }

  async publishEvent(event: Event) {
    const confirm = await Modals.confirm({
      title: 'Confirm',
      message: 'Are you sure that you want publish this event? All current members will be notified.'
    });

    if (confirm.value) {
      this.eventService.publish(event).subscribe(async (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          await Toast.show({
            text: 'Event published!'
          });
          this.eventService.refreshData();
        }
      });
    }
  }

  async archiveEvent(event: Event) {
    if (event && !event.certified && !event.submitted_for_certification) {
      const confirm = await Modals.confirm({
        title: 'Confirm',
        message: 'Are you sure you want to archive this event?'
      });

      if (confirm.value) {
        this.eventService.archive(event).subscribe(async (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            await Toast.show({
              text: 'Event archived!'
            });
            this.events.splice(this.events.findIndex(x => x.id === event.id), 1);
          }
        });
      }
    }
  }

  openEvent(event: Event) {
    // this.eventService.setPassData(event);
    // this.nav.navigateForward(`/tabs/event/details/${event.id}`);
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        event
      }
    };

    this.router.navigate([event.id], navigationExtras);
  }

  async ngOnInit() {
    this.isAdmin = await this.authService.hasClaim(19);

    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();
  }

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.fetchEvents();
    if (this.isAdmin) {
      this.fetchExpiredEvents();
    }
  }

  ionViewDidLeave() {
  }

}
