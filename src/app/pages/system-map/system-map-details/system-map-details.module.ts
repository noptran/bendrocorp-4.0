import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SystemMapDetailsPageRoutingModule } from './system-map-details-routing.module';

import { SystemMapDetailsPage } from './system-map-details.page';
import { SystemMapDetailTagsComponent } from 'src/app/components/system-map/system-map-detail-tags/system-map-detail-tags.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SystemMapDetailsPageRoutingModule
  ],
  declarations: [
    SystemMapDetailsPage,
    SystemMapDetailTagsComponent
  ]
})
export class SystemMapDetailsPageModule {}
