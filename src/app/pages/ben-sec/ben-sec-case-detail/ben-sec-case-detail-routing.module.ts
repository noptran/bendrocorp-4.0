import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BenSecCaseDetailPage } from './ben-sec-case-detail.page';

const routes: Routes = [
  {
    path: '',
    component: BenSecCaseDetailPage
  },
  {
    path: 'incidents',
    loadChildren: () => import('../ben-sec-incident-list/ben-sec-incident-list.module').then( m => m.BenSecIncidentListPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenSecCaseDetailPageRoutingModule {}
