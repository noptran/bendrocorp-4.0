import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffenderDetailPage } from './offender-detail.page';

const routes: Routes = [
  {
    path: '',
    component: OffenderDetailPage
  },
  {
    path: 'report/:reportId',
    loadChildren: () => import('./offender-report-detail/offender-report-detail.module').then( m => m.OffenderReportDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffenderDetailPageRoutingModule {}
