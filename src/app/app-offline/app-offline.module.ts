import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppOfflinePageRoutingModule } from './app-offline-routing.module';

import { AppOfflinePage } from './app-offline.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppOfflinePageRoutingModule
  ],
  declarations: [AppOfflinePage]
})
export class AppOfflinePageModule {}
