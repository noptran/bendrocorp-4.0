import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsPageRoutingModule } from './events-routing.module';

import { EventPage } from './events.page';
import { CertifyEventComponentModule } from 'src/app/components/events/certify-event/certify-event.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsPageRoutingModule,
    CertifyEventComponentModule
  ],
  declarations: [EventPage]
})
export class EventsPageModule {}
