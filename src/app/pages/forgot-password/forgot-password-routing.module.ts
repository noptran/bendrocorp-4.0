import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAuthGuard } from 'src/app/no-auth.guard';

import { ForgotPasswordPage } from './forgot-password.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordPage
  },
  {
    path: ':token',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./forgot-password-complete/forgot-password-complete.module').then( m => m.ForgotPasswordCompletePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordPageRoutingModule {}
