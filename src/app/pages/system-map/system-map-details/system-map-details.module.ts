import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SystemMapDetailsPageRoutingModule } from './system-map-details-routing.module';

import { SystemMapDetailsPage } from './system-map-details.page';
import { SystemMapListCardComponentModule } from 'src/app/components/system-map/system-map-list-card/system-map-list-card.module';
import { SystemMapListTagsComponentModule } from 'src/app/components/system-map/system-map-list-tags/system-map-list-tags.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SystemMapDetailsPageRoutingModule,
    SystemMapListCardComponentModule,
    SystemMapListTagsComponentModule
  ],
  declarations: [
    SystemMapDetailsPage,
  ]
})
export class SystemMapDetailsPageModule {}
