import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalPage } from './approval.page';

const routes: Routes = [
  {
    path: '',
    component: ApprovalPage
  },
  {
    path: 'details/:approvalId',
    loadChildren: () => import('./approval-details/approval-details.module').then( m => m.ApprovalDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalPageRoutingModule {}
