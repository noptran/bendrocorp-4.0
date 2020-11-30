import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { CountdownChartComponent } from 'src/app/components/dashboard/countdown-chart/countdown-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    // CountdownChartComponent
  ],
  declarations: [DashboardPage, CountdownChartComponent]
})
export class DashboardPageModule {}
