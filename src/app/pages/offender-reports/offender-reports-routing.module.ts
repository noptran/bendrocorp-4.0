import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffenderReportsPage } from './offender-reports.page';

const routes: Routes = [
  {
    path: '',
    component: OffenderReportsPage
  },
  {
    path: ':offenderId',
    loadChildren: () => import('./offender-detail/offender-detail.module').then( m => m.OffenderDetailPageModule)
  },
  // {
  //   path: 'offender-report',
  //   loadChildren: () => import('./offender-report/offender-report.module').then( m => m.OffenderReportPageModule)
  // },
  // {
  //   path: ':id/report-detail/:reportId',
  //   loadChildren: () => import('./offender-report-detail/offender-report-detail.module').then( m => m.OffenderReportDetailPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffenderReportsPageRoutingModule {}
