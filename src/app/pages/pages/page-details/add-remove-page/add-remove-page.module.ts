import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRemovePagePageRoutingModule } from './add-remove-page-routing.module';

import { AddRemovePagePage } from './add-remove-page.page';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddRemovePagePageRoutingModule,
    NgxSummernoteModule,
  ],
  declarations: [AddRemovePagePage]
})
export class AddRemovePagePageModule {}
