import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileServiceRecordPageRoutingModule } from './profile-service-record-routing.module';

import { ProfileServiceRecordPage } from './profile-service-record.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileServiceRecordPageRoutingModule
  ],
  declarations: [ProfileServiceRecordPage]
})
export class ProfileServiceRecordPageModule {}
