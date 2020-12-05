import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileInterviewPage } from './profile-interview.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileInterviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileInterviewPageRoutingModule {}
