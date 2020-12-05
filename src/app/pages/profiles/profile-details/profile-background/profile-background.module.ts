import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileBackgroundPageRoutingModule } from './profile-background-routing.module';

import { ProfileBackgroundPage } from './profile-background.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileBackgroundPageRoutingModule
  ],
  declarations: [ProfileBackgroundPage]
})
export class ProfileBackgroundPageModule {}
