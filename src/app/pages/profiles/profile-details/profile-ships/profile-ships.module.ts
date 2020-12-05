import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileShipsPageRoutingModule } from './profile-ships-routing.module';

import { ProfileShipsPage } from './profile-ships.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileShipsPageRoutingModule
  ],
  declarations: [ProfileShipsPage]
})
export class ProfileShipsPageModule {}
