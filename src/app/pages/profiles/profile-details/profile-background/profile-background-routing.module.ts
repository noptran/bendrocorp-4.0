import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileBackgroundPage } from './profile-background.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileBackgroundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileBackgroundPageRoutingModule {}
