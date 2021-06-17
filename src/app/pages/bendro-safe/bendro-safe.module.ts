import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BendroSafePageRoutingModule } from './bendro-safe-routing.module';

import { BendroSafePage } from './bendro-safe.page';
import { BendroSafeSearchResultComponentModule } from 'src/app/components/bendro-safe/bendro-safe-search-result/bendro-safe-search-result.module';
import { IncidentReportListItemComponentModule } from 'src/app/components/ben-sec/incident-report-list-item/incident-report-list-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BendroSafePageRoutingModule,
    BendroSafeSearchResultComponentModule,
    IncidentReportListItemComponentModule
  ],
  declarations: [BendroSafePage]
})
export class BendroSafePageModule {}
