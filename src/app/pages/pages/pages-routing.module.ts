import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesPage } from './pages.page';

const routes: Routes = [
  {
    path: '',
    component: PagesPage
  },
  {
    path: ':id',
    loadChildren: () => import('./page-details/page-details.module').then( m => m.PageDetailsPageModule)
  },
  // {
  //   path: 'add',
  //   loadChildren: () => import('./add-remove-page/add-remove-page.module').then( m => m.AddRemovePagePageModule)
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule {}
