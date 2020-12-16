import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffenderDetailPageRoutingModule } from './offender-detail-routing.module';

import { OffenderDetailPage } from './offender-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffenderDetailPageRoutingModule
  ],
  declarations: [OffenderDetailPage]
})
export class OffenderDetailPageModule {}
