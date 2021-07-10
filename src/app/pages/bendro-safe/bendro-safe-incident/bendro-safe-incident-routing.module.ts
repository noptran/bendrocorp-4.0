import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BendroSafeIncidentPage } from './bendro-safe-incident.page';

const routes: Routes = [
  {
    path: '',
    component: BendroSafeIncidentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BendroSafeIncidentPageRoutingModule {}
