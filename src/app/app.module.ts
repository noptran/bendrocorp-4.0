import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth.service';
import { HttpClient, HttpClientModule, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.intercepter';
import { EventService } from './services/event.service';
import { ProfileService } from './services/profile.service';
import { RequestsService } from './services/requests.service';
import { LoadingService } from './services/loading-service.service';
import { CommonModule } from '@angular/common';
import { UpdateAvatarComponent } from './components/update-avatar/update-avatar.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SettingsComponent } from './components/settings/settings.component';
import { FormsModule } from '@angular/forms';
import { EventAddUpdateComponent } from './components/events/event-add-update/event-add-update.component';
import { CertifyEventComponent } from './components/events/certify-event/certify-event.component';
import { CompleteJobComponent } from './components/jobs/complete-job/complete-job.component';
import { AddUpdateJobComponent } from './components/jobs/add-update-job/add-update-job.component';
import { AddUpdateFlightLogComponent } from './componenents/flight-logs/add-update-flight-log/add-update-flight-log.component';

@NgModule({
  declarations: [
    AppComponent,
    UpdateAvatarComponent,
    SettingsComponent,
    EventAddUpdateComponent,
    CertifyEventComponent,
    EventAddUpdateComponent,
    CompleteJobComponent,
    AddUpdateJobComponent,
    AddUpdateFlightLogComponent
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    QRCodeModule,
    FormsModule
  ],
  providers: [
    LoadingService,
    AuthInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    StatusBar,
    SplashScreen,
    HttpClient,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    //
    EventService,
    ProfileService,
    RequestsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
