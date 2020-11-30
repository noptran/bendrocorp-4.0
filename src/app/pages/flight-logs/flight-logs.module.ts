import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightLogsPageRoutingModule } from './flight-logs-routing.module';

import { FlightLogsPage } from './flight-logs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightLogsPageRoutingModule
  ],
  declarations: [FlightLogsPage]
})
export class FlightLogsPageModule {}
