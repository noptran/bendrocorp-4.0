import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { CountdownChartComponent } from 'src/app/components/dashboard/countdown-chart/countdown-chart.component';
import { TopGreebleComponent } from 'src/app/components/top-greeble/top-greeble.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    // CountdownChartComponent
    // TopGreebleComponent
  ],
  declarations: [
    DashboardPage,
    CountdownChartComponent,
    TopGreebleComponent
  ]
})
export class DashboardPageModule {}
