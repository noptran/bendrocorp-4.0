import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AddUpdateFlightLogComponent } from 'src/app/componenents/flight-logs/add-update-flight-log/add-update-flight-log.component';
import { FlightLog } from 'src/app/models/flight-log.model';
import { FlightLogService } from 'src/app/services/flight-log.service';
import { Plugins } from '@capacitor/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

const { Modals } = Plugins;

@Component({
  selector: 'app-flight-logs',
  templateUrl: './flight-logs.page.html',
  styleUrls: ['./flight-logs.page.scss'],
})
export class FlightLogsPage implements OnInit, OnDestroy {

  flightLogs: FlightLog[];
  flightLogSubscription: Subscription;
  initialDataLoaded: boolean;
  loadingIndicator: any;

  constructor(
    private flightLogService: FlightLogService,
    private navController: NavController,
    private modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingController) {
      this.flightLogSubscription = this.flightLogService.dataRefreshAnnounced$.subscribe((results) => {
        this.retrieveFlightLogs();
      });
    }

  doRefresh(event: any) {
    this.retrieveFlightLogs(event);
  }

  async archiveFlightLog(flightLog: FlightLog) {
    const confirmRet = await Modals.confirm({
      title: 'Confirm',
      message: 'Are you sure you want to archive this flight log?'
    });

    if (confirmRet.value) {
      this.flightLogService.delete(flightLog).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.flightLogs.splice(this.flightLogs.findIndex(x => x.id === flightLog.id), 1);
        }
      });
    }
  }

  openFlightLog(flightLog: FlightLog) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      state: {
        flightLog
      }
    };

    this.router.navigate([flightLog.id], navigationExtras);
  }

  async addUpdateFlightLog(flightLog?: FlightLog) {
    if (flightLog) {
      this.flightLogService.setPassData(flightLog);
    }

    const modal = await this.modalController.create({
      component: AddUpdateFlightLogComponent
    });
    return await modal.present();
  }

  retrieveFlightLogs(event?: any) {
    this.flightLogService.list().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.flightLogs = results;
        console.log(this.flightLogs);
      }

      if (!this.initialDataLoaded) {
        this.initialDataLoaded = true;
        this.loading.dismiss();
        this.loadingIndicator.dismiss();
      }

      if (event) {
        event.target.complete();
      }
    });
  }

  async ngOnInit() {
    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    this.retrieveFlightLogs();
  }

  ngOnDestroy() {
    if (this.flightLogSubscription) {
      this.flightLogSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    if (this.initialDataLoaded) {
      this.retrieveFlightLogs();
    }
  }

  ionViewDidLeave() {
  }

}
