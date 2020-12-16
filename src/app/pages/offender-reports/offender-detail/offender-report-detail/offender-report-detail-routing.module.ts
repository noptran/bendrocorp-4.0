import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffenderReportDetailPage } from './offender-report-detail.page';

const routes: Routes = [
  {
    path: '',
    component: OffenderReportDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffenderReportDetailPageRoutingModule {}
