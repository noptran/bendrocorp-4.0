import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRemovePagePage } from './add-remove-page.page';

const routes: Routes = [
  {
    path: '',
    component: AddRemovePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRemovePagePageRoutingModule {}
