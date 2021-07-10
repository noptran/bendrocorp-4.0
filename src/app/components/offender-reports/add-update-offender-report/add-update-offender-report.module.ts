import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddUpdateOffenderReportComponent } from './add-update-offender-report.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule
  ],
  declarations: [AddUpdateOffenderReportComponent],
  exports: [AddUpdateOffenderReportComponent]
})
export class AddUpdateOffenderReportComponentModule { }
