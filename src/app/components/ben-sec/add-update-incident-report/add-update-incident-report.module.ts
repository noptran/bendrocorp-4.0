import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddUpdateIncidentReportComponent } from './add-update-incident-report.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule
  ],
  declarations: [AddUpdateIncidentReportComponent],
  exports: [AddUpdateIncidentReportComponent]
})
export class AddUpdateIncidentReportComponentModule { }
