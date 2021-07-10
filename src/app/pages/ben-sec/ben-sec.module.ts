import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BenSecPageRoutingModule } from './ben-sec-routing.module';
import { BenSecPage } from './ben-sec.page';
import { AddUpdateIntelReportComponentModule } from 'src/app/components/ben-sec/add-update-intel-report/add-update-intel-report.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { BenSecTagsComponentModule } from 'src/app/components/ben-sec/ben-sec-tags/ben-sec-tags.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    BenSecPageRoutingModule,
    AddUpdateIntelReportComponentModule,
    BenSecTagsComponentModule
  ],
  declarations: [BenSecPage]
})
export class BenSecPageModule {}
