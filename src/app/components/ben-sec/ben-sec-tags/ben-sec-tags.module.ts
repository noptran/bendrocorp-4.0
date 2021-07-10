import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddTagComponentModule } from '../add-tag/add-tag.module';
import { BenSecTagsComponent } from './ben-sec-tags.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    AddTagComponentModule
  ],
  declarations: [BenSecTagsComponent],
  exports: [BenSecTagsComponent]
})
export class BenSecTagsComponentModule { }
