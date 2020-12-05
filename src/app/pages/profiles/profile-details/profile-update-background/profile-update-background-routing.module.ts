import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileUpdateBackgroundPage } from './profile-update-background.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileUpdateBackgroundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileUpdateBackgroundPageRoutingModule {}
