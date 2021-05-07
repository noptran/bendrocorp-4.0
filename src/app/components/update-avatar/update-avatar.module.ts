import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectAvatarComponentModule } from '../misc/select-avatar/select-avatar.module';
import { UpdateAvatarComponent } from './update-avatar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    SelectAvatarComponentModule
  ],
  declarations: [UpdateAvatarComponent],
  exports: [UpdateAvatarComponent]
})
export class UpdateAvatarComponentModule {}
