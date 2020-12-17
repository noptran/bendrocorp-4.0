import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApprovalDetailsPageRoutingModule } from './approval-details-routing.module';

import { ApprovalDetailsPage } from './approval-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApprovalDetailsPageRoutingModule
  ],
  declarations: [ApprovalDetailsPage]
})
export class ApprovalDetailsPageModule {}
