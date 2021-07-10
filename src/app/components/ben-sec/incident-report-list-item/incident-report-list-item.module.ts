import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { IncidentReportListItemComponent } from './incident-report-list-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule
  ],
  declarations: [IncidentReportListItemComponent],
  exports: [IncidentReportListItemComponent]
})
export class IncidentReportListItemComponentModule { }
