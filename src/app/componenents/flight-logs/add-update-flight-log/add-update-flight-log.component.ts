import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FlightLog } from 'src/app/models/flight-log.model';
import { OwnedShip } from 'src/app/models/ship.models';
import { FlightLogService } from 'src/app/services/flight-log.service';

@Component({
  selector: 'app-add-update-flight-log',
  templateUrl: './add-update-flight-log.component.html',
  styleUrls: ['./add-update-flight-log.component.scss'],
})
export class AddUpdateFlightLogComponent implements OnInit {

  @Input() flightLog: FlightLog;
  formAction: string;
  playerShips: OwnedShip[];
  dataSubmitted: boolean;

  constructor(
    private flightLogService: FlightLogService,
    private modalController: ModalController
  ) { }

  addUpdateFlightLog() {
    if (this.flightLog && this.flightLog.id) {
      this.flightLogService.update(this.flightLog).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.flightLogService.refreshData();
          this.dismiss();
        }
      });
    } else {
      this.flightLogService.create(this.flightLog).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.flightLogService.refreshData();
          this.dismiss();
        }
      });
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

  fetchOwnedShips() {
    this.flightLogService.list_ships().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.playerShips = results;
        console.log(this.playerShips);
      }
    });
  }

  ngOnInit() {
    this.fetchOwnedShips();
    this.flightLog = this.flightLogService.fetchAndClearPassedData();
    if (this.flightLog && this.flightLog.id) {
      this.formAction = 'Update';
    } else {
      this.formAction = 'Create';
      this.flightLog = {} as FlightLog;
    }
  }

}
