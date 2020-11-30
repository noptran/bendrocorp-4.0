import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SystemMapPageRoutingModule } from './system-map-routing.module';

import { SystemMapPage } from './system-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SystemMapPageRoutingModule
  ],
  declarations: [SystemMapPage]
})
export class SystemMapPageModule {}
