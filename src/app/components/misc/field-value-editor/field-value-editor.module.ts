import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FieldValueEditorComponent } from './field-value-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [FieldValueEditorComponent],
  exports: [FieldValueEditorComponent]
})
export class FieldValueEditorModule { }
