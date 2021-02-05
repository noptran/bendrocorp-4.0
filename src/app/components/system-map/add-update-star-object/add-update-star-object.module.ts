import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { FieldValueEditorModule } from '../../misc/field-value-editor/field-value-editor.module';
import { SelectAvatarComponentModule } from '../../misc/select-avatar/select-avatar.module';
import { AddUpdateStarObjectComponent } from './add-update-star-object.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    SelectAvatarComponentModule,
    FieldValueEditorModule
  ],
  declarations: [AddUpdateStarObjectComponent],
  exports: [AddUpdateStarObjectComponent]
})
export class AddUpdateStarObjectComponentModule {}
