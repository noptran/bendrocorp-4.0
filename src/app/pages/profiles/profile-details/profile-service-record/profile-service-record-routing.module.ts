import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileServiceRecordPage } from './profile-service-record.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileServiceRecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileServiceRecordPageRoutingModule {}
