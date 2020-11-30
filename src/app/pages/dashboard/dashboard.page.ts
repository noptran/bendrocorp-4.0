import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TimeSpan } from 'ng-timespan';
import { interval, Subscription } from 'rxjs';
import { Event } from 'src/app/models/event.model';
import { ILNewsStory } from 'src/app/models/news.model';
import { UserSessionResponse } from 'src/app/models/user.model';
import { EventService } from 'src/app/services/event.service';
import { LoadingService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  nextEvent: Event;
  news: ILNewsStory[] = [];
  events: Event[];
  eventStartedSubscription: Subscription;
  eventsFetched: boolean = false;
  newsFetched: boolean = true;
  showCountdown: boolean;
  showStartCountdown: boolean;
  showEndCountdown: boolean;
  checkerStarted: boolean;
  initialDataLoaded: boolean = false;

  constructor(
    private eventService: EventService,
    private loadingService: LoadingService
  ) { }

  async ngOnInit() {
    this.loadingService.show();
    this.fetchEvents();
  }

  ngOnDestroy() {
    if (this.eventStartedSubscription) {
      this.eventStartedSubscription.unsubscribe();
    }
  }

  fetchEvents(event?: any) {
    this.eventsFetched = false;
    this.showStartCountdown = false;
    this.showEndCountdown = false;

    // if this sub exists get rid of it since this method will rebuild it
    if (this.eventStartedSubscription) {
      this.eventStartedSubscription.unsubscribe();
    }

    this.eventService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          console.log(results);
          if (results.length > 0) {
            // get the first event
            this.nextEvent = results.slice(0, 1)[0];
            this.events = results.splice(0, 1);

            // set fetched to true?
            this.eventsFetched = true;

            if (event) {
              if (this.newsFetched && this.eventsFetched) {
                if (!this.initialDataLoaded) {
                  this.initialDataLoaded = true;
                }
                this.loadingService.dismiss();
                event.target.complete();
              }
            }

            if (this.newsFetched && this.eventsFetched) {
              if (!this.initialDataLoaded) {
                this.initialDataLoaded = true;
              }
              this.loadingService.dismiss();
            } else {
              console.log(`e n ${this.newsFetched} e ${this.eventsFetched}`);
            }

            // if we found a next event do the work to monitor it
            if (this.nextEvent) {
              this.eventStartedSubscription = interval(500).subscribe(
                () => {
                  // if the start date is less than now
                  const eventStart = new Date(this.nextEvent.start_date);
                  const eventEnd = new Date(this.nextEvent.end_date);

                  const currentToStart = TimeSpan.Subtract(new Date(), eventStart); //new Date().getTime();
                  const currentToEnd = TimeSpan.Subtract(new Date(), eventEnd);

                  // console.log(`Dashboard Event:: STTC: ${currentToStart.totalSeconds}, ETTC: ${currentToEnd.totalSeconds}`);

                  if (currentToStart.totalSeconds > 0 && currentToEnd.totalSeconds > 0) { // event is still upcoming
                    // console.log('Dashboard: Event upcoming!');
                    this.showStartCountdown = true;
                    this.showEndCountdown = false;

                  } else if (currentToStart.totalSeconds <= 0 && currentToEnd.totalSeconds > 0) { // event is happening now
                    // console.log('Dashboard: Event happening now!');
                    this.showStartCountdown = false;
                    this.showEndCountdown = true;
                    // this.eventStartedSubscription.unsubscribe();
                  } else if (currentToStart.totalSeconds <= 0 && currentToEnd.totalSeconds <= 0) { // event has ended and we need to see if there is a new event
                    // console.log('Dashboard: Event expired!');
                    this.showStartCountdown = false;
                    this.showEndCountdown = false;
                    this.nextEvent = null;
                    this.fetchEvents();
                  }
                  this.checkerStarted = true;
                }
              );
            }
          } else {
            this.eventsFetched = true;

            if (event) {
              if (this.newsFetched && this.eventsFetched) {
                if (!this.initialDataLoaded) {
                  this.initialDataLoaded = true;
                }
                this.loadingService.dismiss();
                event.target.complete();
              }
            }

            if (this.newsFetched && this.eventsFetched) {
              if (!this.initialDataLoaded) {
                this.initialDataLoaded = true;
              }
              this.loadingService.dismiss();
            } else {
              console.log(`en n ${this.newsFetched} e ${this.eventsFetched}`);
            }
          }
        }
      }
    );
  }
}
