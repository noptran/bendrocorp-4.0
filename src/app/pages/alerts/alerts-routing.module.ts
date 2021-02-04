import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertsPage } from './alerts.page';

const routes: Routes = [
  {
    path: '',
    component: AlertsPage
  },
  {
    path: ':id',
    loadChildren: () => import('./alert-detail/alert-detail.module').then( m => m.AlertDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertsPageRoutingModule {}
