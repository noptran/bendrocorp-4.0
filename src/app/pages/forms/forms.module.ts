import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormsPageRoutingModule } from './forms-routing.module';

import { FormsPage } from './forms.page';
import { AddUpdateFormComponentModule } from 'src/app/components/forms/add-update-form/add-update-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsPageRoutingModule,
    AddUpdateFormComponentModule
  ],
  declarations: [FormsPage]
})
export class FormsPageModule {}
