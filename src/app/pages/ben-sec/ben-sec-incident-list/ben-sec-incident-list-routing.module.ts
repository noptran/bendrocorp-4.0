import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BenSecIncidentListPage } from './ben-sec-incident-list.page';

const routes: Routes = [
  {
    path: '',
    component: BenSecIncidentListPage
  },
  // BUG: Something is going on with the module, its causing a call stack error
  {
    path: ':incident_id',
    loadChildren: () => import('../ben-sec-incident-detail/ben-sec-incident-detail.module').then( m => m.BenSecIncidentDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenSecIncidentListPageRoutingModule {}
