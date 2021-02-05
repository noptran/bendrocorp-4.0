import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertsPageRoutingModule } from './alerts-routing.module';

import { AlertsPage } from './alerts.page';
import { ViewAlertComponentModule } from 'src/app/components/alerts/view-alert/view-alert.module';
import { AddUpdateAlertComponentModule } from 'src/app/components/alerts/add-update-alert/add-update-alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertsPageRoutingModule,
    ViewAlertComponentModule,
    AddUpdateAlertComponentModule
  ],
  declarations: [AlertsPage]
})
export class AlertsPageModule {}
