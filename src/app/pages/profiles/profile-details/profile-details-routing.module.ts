import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileDetailsPage } from './profile-details.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileDetailsPage
  },  {
    path: 'profile-application',
    loadChildren: () => import('./profile-application/profile-application.module').then( m => m.ProfileApplicationPageModule)
  },
  {
    path: 'profile-background',
    loadChildren: () => import('./profile-background/profile-background.module').then( m => m.ProfileBackgroundPageModule)
  },
  {
    path: 'profile-interview',
    loadChildren: () => import('./profile-interview/profile-interview.module').then( m => m.ProfileInterviewPageModule)
  },
  {
    path: 'profile-interview-hints',
    loadChildren: () => import('./profile-interview-hints/profile-interview-hints.module').then( m => m.ProfileInterviewHintsPageModule)
  },
  {
    path: 'profile-service-record',
    loadChildren: () => import('./profile-service-record/profile-service-record.module').then( m => m.ProfileServiceRecordPageModule)
  },
  {
    path: 'profile-ships',
    loadChildren: () => import('./profile-ships/profile-ships.module').then( m => m.ProfileShipsPageModule)
  },
  {
    path: 'profile-ships-add-update',
    loadChildren: () => import('./profile-ships-add-update/profile-ships-add-update.module').then( m => m.ProfileShipsAddUpdatePageModule)
  },
  {
    path: 'profile-update-background',
    loadChildren: () => import('./profile-update-background/profile-update-background.module').then( m => m.ProfileUpdateBackgroundPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileDetailsPageRoutingModule {}
