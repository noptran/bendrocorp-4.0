import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageDetailsPage } from './page-details.page';

const routes: Routes = [
  {
    path: '',
    component: PageDetailsPage
  },
  {
    path: 'edit',
    loadChildren: () => import('../add-remove-page/add-remove-page.module').then(m => m.AddRemovePagePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageDetailsPageRoutingModule {}
