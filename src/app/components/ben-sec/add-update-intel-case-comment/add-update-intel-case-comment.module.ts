import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddUpdateIntelCaseCommentComponent } from './add-update-intel-case-comment.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [AddUpdateIntelCaseCommentComponent],
  exports: [AddUpdateIntelCaseCommentComponent]
})
export class AddUpdateIntelCaseCommentComponentModule { }
