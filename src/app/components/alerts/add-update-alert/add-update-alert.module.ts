import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddUpdateAlertComponent } from './add-update-alert.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule
  ],
  declarations: [AddUpdateAlertComponent],
  exports: [AddUpdateAlertComponent]
})
export class AddUpdateAlertComponentModule {}
