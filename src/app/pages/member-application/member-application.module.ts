import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberApplicationPageRoutingModule } from './member-application-routing.module';

import { MemberApplicationPage } from './member-application.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberApplicationPageRoutingModule
  ],
  declarations: [MemberApplicationPage]
})
export class MemberApplicationPageModule {}
