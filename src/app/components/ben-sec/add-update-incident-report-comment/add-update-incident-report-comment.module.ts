import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddUpdateIncidentReportCommentComponent } from './add-update-incident-report-comment.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [AddUpdateIncidentReportCommentComponent],
  exports: [AddUpdateIncidentReportCommentComponent]
})
export class AddUpdateIncidentReportCommentComponentModule { }
