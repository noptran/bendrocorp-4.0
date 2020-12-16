import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffenderReportPageRoutingModule } from './offender-report-routing.module';

import { OffenderReportPage } from './offender-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffenderReportPageRoutingModule
  ],
  declarations: [OffenderReportPage]
})
export class OffenderReportPageModule {}
