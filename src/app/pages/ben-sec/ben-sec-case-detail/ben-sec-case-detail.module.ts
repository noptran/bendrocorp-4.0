import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BenSecCaseDetailPageRoutingModule } from './ben-sec-case-detail-routing.module';

import { BenSecCaseDetailPage } from './ben-sec-case-detail.page';
import { BendroSafeSearchResultTopComponentModule } from 'src/app/components/bendro-safe/bendro-safe-search-result-top/bendro-safe-search-result-top.module';
import { BenSecTagsComponentModule } from 'src/app/components/ben-sec/ben-sec-tags/ben-sec-tags.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddUpdateIntelCaseCommentComponentModule } from 'src/app/components/ben-sec/add-update-intel-case-comment/add-update-intel-case-comment.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BenSecCaseDetailPageRoutingModule,
    BendroSafeSearchResultTopComponentModule,
    BenSecTagsComponentModule,
    IonicSelectableModule,
    AddUpdateIntelCaseCommentComponentModule
  ],
  declarations: [BenSecCaseDetailPage]
})
export class BenSecCaseDetailPageModule {}
