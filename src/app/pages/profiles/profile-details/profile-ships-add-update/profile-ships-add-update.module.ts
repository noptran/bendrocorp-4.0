import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileShipsAddUpdatePageRoutingModule } from './profile-ships-add-update-routing.module';

import { ProfileShipsAddUpdatePage } from './profile-ships-add-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileShipsAddUpdatePageRoutingModule
  ],
  declarations: [ProfileShipsAddUpdatePage]
})
export class ProfileShipsAddUpdatePageModule {}
