import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddUpdateIncidentReportComponentModule } from '../../ben-sec/add-update-incident-report/add-update-incident-report.module';
import { AddUpdateIntelReportComponentModule } from '../../ben-sec/add-update-intel-report/add-update-intel-report.module';
import { AddUpdateOffenderReportComponentModule } from '../../offender-reports/add-update-offender-report/add-update-offender-report.module';
import { BendroSafeSearchResultTopComponentModule } from '../bendro-safe-search-result-top/bendro-safe-search-result-top.module';
import { BendroSafeSearchResultComponent } from './bendro-safe-search-result.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    AddUpdateIntelReportComponentModule,
    AddUpdateOffenderReportComponentModule,
    BendroSafeSearchResultTopComponentModule,
    AddUpdateIncidentReportComponentModule
  ],
  declarations: [BendroSafeSearchResultComponent],
  exports: [BendroSafeSearchResultComponent]
})
export class BendroSafeSearchResultComponentModule { }
