import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsPage } from './forms.page';

const routes: Routes = [
  {
    path: '',
    component: FormsPage
  },
  {
    path: ':id',
    loadChildren: () => import('./form-detail/form-detail.module').then( m => m.FormDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsPageRoutingModule {}
