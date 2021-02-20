import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventDetailsPageRoutingModule } from './event-details-routing.module';

import { EventDetailsPage } from './event-details.page';
import { CertifyEventComponentModule } from 'src/app/components/events/certify-event/certify-event.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventDetailsPageRoutingModule,
    CertifyEventComponentModule
  ],
  declarations: [EventDetailsPage]
})
export class EventDetailsPageModule {}
