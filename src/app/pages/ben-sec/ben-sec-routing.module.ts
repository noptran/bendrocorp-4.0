import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BenSecPage } from './ben-sec.page';

const routes: Routes = [
  {
    path: '',
    component: BenSecPage
  },
  {
    path: ':case_id',
    loadChildren: () => import('./ben-sec-case-detail/ben-sec-case-detail.module').then( m => m.BenSecCaseDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenSecPageRoutingModule {}
