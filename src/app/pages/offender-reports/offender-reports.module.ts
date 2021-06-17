import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OffenderReportsPageRoutingModule } from './offender-reports-routing.module';
import { OffenderReportsPage } from './offender-reports.page';
import { BendroSafeSearchResultComponentModule } from 'src/app/components/bendro-safe/bendro-safe-search-result/bendro-safe-search-result.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffenderReportsPageRoutingModule,
    BendroSafeSearchResultComponentModule
  ],
  declarations: [OffenderReportsPage]
})
export class OffenderReportsPageModule {}
