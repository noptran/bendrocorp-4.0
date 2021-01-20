import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberApplicationPage } from './member-application.page';

const routes: Routes = [
  {
    path: '',
    component: MemberApplicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberApplicationPageRoutingModule {}
