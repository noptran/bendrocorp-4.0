import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRemovePagePageRoutingModule } from './add-remove-page-routing.module';

import { AddRemovePagePage } from './add-remove-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddRemovePagePageRoutingModule
  ],
  declarations: [AddRemovePagePage]
})
export class AddRemovePagePageModule {}
