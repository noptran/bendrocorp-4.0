import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BenSecIncidentListPageRoutingModule } from './ben-sec-incident-list-routing.module';

import { BenSecIncidentListPage } from './ben-sec-incident-list.page';
import { IncidentReportListItemComponentModule } from 'src/app/components/ben-sec/incident-report-list-item/incident-report-list-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BenSecIncidentListPageRoutingModule,
    IncidentReportListItemComponentModule
  ],
  declarations: [BenSecIncidentListPage]
})
export class BenSecIncidentListPageModule {}
