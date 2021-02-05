import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectAvatarComponentModule } from '../../misc/select-avatar/select-avatar.module';
import { AddUpdateSystemImageComponent } from './add-update-system-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    SelectAvatarComponentModule
  ],
  declarations: [AddUpdateSystemImageComponent],
  exports: [AddUpdateSystemImageComponent]
})
export class AddUpdateSystemImageComponentModule {}
