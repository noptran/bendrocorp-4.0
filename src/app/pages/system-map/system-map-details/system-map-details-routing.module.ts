import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemMapDetailsPage } from './system-map-details.page';

const routes: Routes = [
  {
    path: '',
    component: SystemMapDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemMapDetailsPageRoutingModule {}
