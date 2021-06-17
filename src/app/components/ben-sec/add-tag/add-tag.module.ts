import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { BendroSafeSearchResultTopComponentModule } from '../../bendro-safe/bendro-safe-search-result-top/bendro-safe-search-result-top.module';
import { AddTagComponent } from './add-tag.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule
  ],
  declarations: [AddTagComponent],
  exports: [AddTagComponent]
})
export class AddTagComponentModule { }
