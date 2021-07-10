import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { BendroSafeSearchResultTopComponent } from './bendro-safe-search-result-top.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule
  ],
  declarations: [BendroSafeSearchResultTopComponent],
  exports: [BendroSafeSearchResultTopComponent]
})
export class BendroSafeSearchResultTopComponentModule { }
