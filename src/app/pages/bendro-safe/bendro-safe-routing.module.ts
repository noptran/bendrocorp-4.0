import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BendroSafePage } from './bendro-safe.page';

const routes: Routes = [
  {
    path: '',
    component: BendroSafePage
  },
  {
    path: ':incident_id',
    loadChildren: () => import('./bendro-safe-incident/bendro-safe-incident.module').then( m => m.BendroSafeIncidentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BendroSafePageRoutingModule {}
