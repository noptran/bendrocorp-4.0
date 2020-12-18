import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageDetailsPageRoutingModule } from './page-details-routing.module';

import { PageDetailsPage } from './page-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageDetailsPageRoutingModule
  ],
  declarations: [PageDetailsPage]
})
export class PageDetailsPageModule {}
