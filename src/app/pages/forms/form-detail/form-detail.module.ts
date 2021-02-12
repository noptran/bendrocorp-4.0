import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormDetailPageRoutingModule } from './form-detail-routing.module';

import { FormDetailPage } from './form-detail.page';
import { AddUpdateFormComponentModule } from 'src/app/components/forms/add-update-form/add-update-form.module';
import { FormStatusComponentModule } from 'src/app/components/forms/form-status/form-status.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormDetailPageRoutingModule,
    AddUpdateFormComponentModule,
    FormStatusComponentModule,
    IonicSelectableModule
  ],
  declarations: [FormDetailPage]
})
export class FormDetailPageModule {}
