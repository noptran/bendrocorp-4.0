import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemMapPage } from './system-map.page';

const routes: Routes = [
  {
    path: '',
    component: SystemMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemMapPageRoutingModule {}
