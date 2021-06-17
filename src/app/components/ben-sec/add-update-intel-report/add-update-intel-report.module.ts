import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { BendroSafeSearchResultTopComponentModule } from '../../bendro-safe/bendro-safe-search-result-top/bendro-safe-search-result-top.module';
import { AddUpdateIntelReportComponent } from './add-update-intel-report.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    BendroSafeSearchResultTopComponentModule
  ],
  declarations: [AddUpdateIntelReportComponent],
  exports: [AddUpdateIntelReportComponent]
})
export class AddUpdateIntelReportComponentModule { }
