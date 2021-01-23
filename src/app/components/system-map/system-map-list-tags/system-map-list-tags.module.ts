import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SystemMapListTagsComponent } from './system-map-list-tags.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [SystemMapListTagsComponent],
  exports: [SystemMapListTagsComponent]
})
export class SystemMapListTagsComponentModule {}
