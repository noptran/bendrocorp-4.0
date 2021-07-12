import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LongPressDirective } from './long-press.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [LongPressDirective],
  exports: [LongPressDirective]
})
export class LongPressDirectiveModule { }
