import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffenderReportsPage } from './offender-reports.page';

const routes: Routes = [
  {
    path: '',
    component: OffenderReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffenderReportsPageRoutingModule {}
