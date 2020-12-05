import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileInterviewHintsPageRoutingModule } from './profile-interview-hints-routing.module';

import { ProfileInterviewHintsPage } from './profile-interview-hints.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileInterviewHintsPageRoutingModule
  ],
  declarations: [ProfileInterviewHintsPage]
})
export class ProfileInterviewHintsPageModule {}
