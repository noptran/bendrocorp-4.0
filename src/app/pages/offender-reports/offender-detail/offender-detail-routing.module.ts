import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffenderDetailPage } from './offender-detail.page';

const routes: Routes = [
  {
    path: '',
    component: OffenderDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffenderDetailPageRoutingModule {}
