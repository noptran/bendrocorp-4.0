import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { BendroSafeSearchResultTopComponentModule } from '../../bendro-safe/bendro-safe-search-result-top/bendro-safe-search-result-top.module';
import { AddUpdateIncidentReportCommentComponentModule } from '../add-update-incident-report-comment/add-update-incident-report-comment.module';
import { AddUpdateIncidentReportComponentModule } from '../add-update-incident-report/add-update-incident-report.module';
import { IncidentReportDetailContentComponent } from './incident-report-detail-content.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    BendroSafeSearchResultTopComponentModule,
    AddUpdateIncidentReportComponentModule,
    AddUpdateIncidentReportCommentComponentModule
  ],
  declarations: [IncidentReportDetailContentComponent],
  exports: [IncidentReportDetailContentComponent]
})
export class IncidentReportDetailContentComponentModule { }
