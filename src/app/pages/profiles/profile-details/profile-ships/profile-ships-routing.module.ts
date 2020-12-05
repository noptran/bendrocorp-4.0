import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileShipsPage } from './profile-ships.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileShipsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileShipsPageRoutingModule {}
