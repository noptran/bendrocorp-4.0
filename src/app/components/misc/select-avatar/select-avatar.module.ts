import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SelectAvatarComponent } from './select-avatar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [SelectAvatarComponent],
  exports: [SelectAvatarComponent]
})
export class SelectAvatarComponentModule {}
