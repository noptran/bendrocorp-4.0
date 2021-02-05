import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SystemMapListCardComponentModule } from '../../system-map/system-map-list-card/system-map-list-card.module';
import { ViewAlertComponent } from './view-alert.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SystemMapListCardComponentModule
  ],
  declarations: [ViewAlertComponent],
  exports: [ViewAlertComponent]
})
export class ViewAlertComponentModule {}
