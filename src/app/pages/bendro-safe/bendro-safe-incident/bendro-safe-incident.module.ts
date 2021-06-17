import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BendroSafeIncidentPageRoutingModule } from './bendro-safe-incident-routing.module';

import { BendroSafeIncidentPage } from './bendro-safe-incident.page';
import { IncidentReportDetailContentComponentModule } from 'src/app/components/ben-sec/incident-report-detail-content/incident-report-detail-content.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BendroSafeIncidentPageRoutingModule,
    IncidentReportDetailContentComponentModule
  ],
  declarations: [BendroSafeIncidentPage]
})
export class BendroSafeIncidentPageModule {}
