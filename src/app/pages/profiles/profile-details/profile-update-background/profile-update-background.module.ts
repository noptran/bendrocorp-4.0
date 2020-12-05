import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileUpdateBackgroundPageRoutingModule } from './profile-update-background-routing.module';

import { ProfileUpdateBackgroundPage } from './profile-update-background.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileUpdateBackgroundPageRoutingModule
  ],
  declarations: [ProfileUpdateBackgroundPage]
})
export class ProfileUpdateBackgroundPageModule {}
