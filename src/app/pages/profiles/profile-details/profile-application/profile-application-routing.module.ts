import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileApplicationPage } from './profile-application.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileApplicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileApplicationPageRoutingModule {}
