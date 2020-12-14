import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobDetailsPageRoutingModule } from './job-details-routing.module';

import { JobDetailsPage } from './job-details.page';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobDetailsPageRoutingModule
  ],
  declarations: [JobDetailsPage]
})
export class JobDetailsPageModule {}
