import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SystemMapDetailsPageRoutingModule } from './system-map-details-routing.module';

import { SystemMapDetailsPage } from './system-map-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SystemMapDetailsPageRoutingModule
  ],
  declarations: [SystemMapDetailsPage]
})
export class SystemMapDetailsPageModule {}
