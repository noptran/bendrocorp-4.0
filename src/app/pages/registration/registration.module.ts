import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationPageRoutingModule } from './registration-routing.module';

import { RegistrationPage } from './registration.page';
import { PasswordComponent } from 'src/app/components/misc/password/password.component';
import { PasswordComponentModule } from 'src/app/components/misc/password/password.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationPageRoutingModule,
    PasswordComponentModule
  ],
  declarations: [
    RegistrationPage
  ]
})
export class RegistrationPageModule {}
