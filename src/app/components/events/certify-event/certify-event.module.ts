import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CertifyEventComponent } from './certify-event.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [CertifyEventComponent],
  exports: [CertifyEventComponent]
})
export class CertifyEventComponentModule {}
