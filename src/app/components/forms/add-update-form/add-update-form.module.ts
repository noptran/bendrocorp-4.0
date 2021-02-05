import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddUpdateFormComponent } from './add-update-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule
  ],
  declarations: [AddUpdateFormComponent],
  exports: [AddUpdateFormComponent]
})
export class AddUpdateFormComponentModule { }
