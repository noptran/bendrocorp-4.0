import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileInterviewPageRoutingModule } from './profile-interview-routing.module';

import { ProfileInterviewPage } from './profile-interview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileInterviewPageRoutingModule
  ],
  declarations: [ProfileInterviewPage]
})
export class ProfileInterviewPageModule {}
