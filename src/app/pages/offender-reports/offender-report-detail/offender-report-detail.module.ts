import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffenderReportDetailPageRoutingModule } from './offender-report-detail-routing.module';

import { OffenderReportDetailPage } from './offender-report-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffenderReportDetailPageRoutingModule
  ],
  declarations: [OffenderReportDetailPage]
})
export class OffenderReportDetailPageModule {}
