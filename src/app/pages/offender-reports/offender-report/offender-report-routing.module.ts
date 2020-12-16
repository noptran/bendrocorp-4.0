import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffenderReportPage } from './offender-report.page';

const routes: Routes = [
  {
    path: '',
    component: OffenderReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffenderReportPageRoutingModule {}
