import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppOfflinePage } from './app-offline.page';

const routes: Routes = [
  {
    path: '',
    component: AppOfflinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppOfflinePageRoutingModule {}
