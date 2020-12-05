import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileInterviewHintsPage } from './profile-interview-hints.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileInterviewHintsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileInterviewHintsPageRoutingModule {}
