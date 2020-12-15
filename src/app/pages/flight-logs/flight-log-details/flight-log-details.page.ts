import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { FlightLog } from 'src/app/models/flight-log.model';
import { FlightLogService } from 'src/app/services/flight-log.service';

@Component({
  selector: 'app-flight-log-details',
  templateUrl: './flight-log-details.page.html',
  styleUrls: ['./flight-log-details.page.scss'],
})
export class FlightLogDetailsPage implements OnInit {

  flightLogId: number;
  flightLog: FlightLog;
  initialDataLoaded = false;
  loadingIndicator: any;
  constructor(
    private flightLogService: FlightLogService,
    private route: ActivatedRoute,
    private router: Router,
    private loading: LoadingController,
    private nav: NavController) { }

  fetchFlightLog(event?: any) {
    this.flightLogService.fetch(this.flightLogId).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.flightLog = results;
        if (!this.initialDataLoaded) {
          this.initialDataLoaded = true;
        }
      } else {
        // this.nav.navigateBack('/tabs/more/flight-log');
        this.router.navigate(['flight-logs']);
      }

      if (this.loadingIndicator) {
        this.loadingIndicator.dismiss();
      }
    });
  }

  doRefresh(event: any) {
    this.fetchFlightLog(event);
  }

  async ngOnInit() {
    if (this.route.snapshot.paramMap.get('id')) {
      this.flightLogId = parseInt(this.route.snapshot.paramMap.get('id'), null);
    }

    if (this.router.getCurrentNavigation()?.extras.state?.flightLog) {
      this.flightLog = this.router.getCurrentNavigation().extras.state.flightLog;
      this.initialDataLoaded = true;
    } else {
      // create the loader
      this.loadingIndicator = await this.loading.create({
        message: 'Loading'
      });
      await this.loadingIndicator.present();

      // fetch the flight log
      this.fetchFlightLog();
    }
  }

}
