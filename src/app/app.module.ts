import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { AddUpdateFlightLogComponent } from './components/flight-logs/add-update-flight-log/add-update-flight-log.component';
import { AddUpdateOffenderReportComponent } from './components/offender-reports/add-update-offender-report/add-update-offender-report.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { EventDetailsPage } from './pages/events/event-details/event-details.page';

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
    AddUpdateFlightLogComponent,
    AddUpdateOffenderReportComponent,
    NewsDetailComponent,
  ],
  entryComponents: [
    // note: These are here because we are not using the Ivy compiler dues to prod build issues. See tsconfig
    // EventAddUpdateComponent,
    // CertifyEventComponent,
    // EventAddUpdateComponent,
    // CompleteJobComponent,
    // AddUpdateJobComponent,
    // AddUpdateFlightLogComponent,
    // AddUpdateOffenderReportComponent,
    // NewsDetailComponent,
    // EventDetailsPage
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    QRCodeModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
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
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
