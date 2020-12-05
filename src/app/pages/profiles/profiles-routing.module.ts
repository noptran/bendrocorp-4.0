import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilesPage } from './profiles.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilesPage
  },
  {
    path: ':id',
    loadChildren: () => import('./profile-details/profile-details.module').then( m => m.ProfileDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilesPageRoutingModule {}
