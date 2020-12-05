import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileApplicationPageRoutingModule } from './profile-application-routing.module';

import { ProfileApplicationPage } from './profile-application.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileApplicationPageRoutingModule
  ],
  declarations: [ProfileApplicationPage]
})
export class ProfileApplicationPageModule {}
