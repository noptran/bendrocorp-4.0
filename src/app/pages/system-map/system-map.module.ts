import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SystemMapPageRoutingModule } from './system-map-routing.module';

import { SystemMapPage } from './system-map.page';
import { SystemMapListCardComponent } from 'src/app/components/system-map/system-map-list-card/system-map-list-card.component';
import { SystemMapListTagsComponent } from 'src/app/components/system-map/system-map-list-tags/system-map-list-tags.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SystemMapPageRoutingModule
  ],
  declarations: [
    SystemMapPage,
    SystemMapListCardComponent,
    SystemMapListTagsComponent
  ]
})
export class SystemMapPageModule {}
