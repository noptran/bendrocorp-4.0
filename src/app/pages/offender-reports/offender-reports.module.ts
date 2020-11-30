import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffenderReportsPageRoutingModule } from './offender-reports-routing.module';

import { OffenderReportsPage } from './offender-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffenderReportsPageRoutingModule
  ],
  declarations: [OffenderReportsPage]
})
export class OffenderReportsPageModule {}
