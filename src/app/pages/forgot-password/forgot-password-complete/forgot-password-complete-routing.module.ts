import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordCompletePage } from './forgot-password-complete.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordCompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordCompletePageRoutingModule {}
