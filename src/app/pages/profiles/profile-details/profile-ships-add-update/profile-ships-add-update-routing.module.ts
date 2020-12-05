import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileShipsAddUpdatePage } from './profile-ships-add-update.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileShipsAddUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileShipsAddUpdatePageRoutingModule {}
