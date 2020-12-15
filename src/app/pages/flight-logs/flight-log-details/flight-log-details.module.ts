import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlightLogDetailsPageRoutingModule } from './flight-log-details-routing.module';

import { FlightLogDetailsPage } from './flight-log-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlightLogDetailsPageRoutingModule
  ],
  declarations: [FlightLogDetailsPage]
})
export class FlightLogDetailsPageModule {}
