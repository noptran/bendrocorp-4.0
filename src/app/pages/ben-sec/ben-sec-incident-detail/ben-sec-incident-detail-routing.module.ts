import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BenSecIncidentDetailPage } from './ben-sec-incident-detail.page';

const routes: Routes = [
  {
    path: '',
    component: BenSecIncidentDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenSecIncidentDetailPageRoutingModule {}
