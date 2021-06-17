import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BenSecIncidentDetailPageRoutingModule } from './ben-sec-incident-detail-routing.module';

import { BenSecIncidentDetailPage } from './ben-sec-incident-detail.page';
import { IncidentReportDetailContentComponentModule } from 'src/app/components/ben-sec/incident-report-detail-content/incident-report-detail-content.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BenSecIncidentDetailPageRoutingModule,
    IncidentReportDetailContentComponentModule,
  ],
  declarations: [BenSecIncidentDetailPage]
})
export class BenSecIncidentDetailPageModule {}
