import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalDetailsPage } from './approval-details.page';

const routes: Routes = [
  {
    path: '',
    component: ApprovalDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalDetailsPageRoutingModule {}
