import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SystemMapListTagsComponentModule } from '../system-map-list-tags/system-map-list-tags.module';
import { SystemImageListCardComponent } from './system-image-list-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [SystemImageListCardComponent],
  exports: [SystemImageListCardComponent]
})
export class SystemImageListCardComponentModule { }
