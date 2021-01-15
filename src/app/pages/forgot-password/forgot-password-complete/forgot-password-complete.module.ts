import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordCompletePageRoutingModule } from './forgot-password-complete-routing.module';

import { ForgotPasswordCompletePage } from './forgot-password-complete.page';
import { PasswordComponentModule } from 'src/app/components/misc/password/password.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPasswordCompletePageRoutingModule,
    PasswordComponentModule
  ],
  declarations: [ForgotPasswordCompletePage]
})
export class ForgotPasswordCompletePageModule {}
