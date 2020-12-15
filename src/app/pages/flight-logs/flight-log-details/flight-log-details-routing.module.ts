import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlightLogDetailsPage } from './flight-log-details.page';

const routes: Routes = [
  {
    path: '',
    component: FlightLogDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightLogDetailsPageRoutingModule {}
