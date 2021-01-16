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
import { TopGreebleComponent } from './components/top-greeble/top-greeble.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { SelectAvatarComponent } from './components/misc/select-avatar/select-avatar.component';
// tslint:disable-next-line:max-line-length
// import { AddSystemMapGravityWellComponent } from './components/system-map/add-system-map-gravity-well/add-system-map-gravity-well.component';
// import { AddSystemMapJumpPointComponent } from './components/system-map/add-system-map-jump-point/add-system-map-jump-point.component';
import { AddUpdateStarObjectComponent } from './components/system-map/add-update-star-object/add-update-star-object.component';
import { SystemMapListTagsComponent } from './components/system-map/system-map-list-tags/system-map-list-tags.component';
import { MakeDonationComponent } from './components/donations/make-donation/make-donation.component';
import { AppUpdateDonationGoalComponent } from './components/donations/app-update-donation-goal/app-update-donation-goal.component';
import { JoinSupporterComponent } from './components/donations/join-supporter/join-supporter.component';
import { PasswordComponent } from './components/misc/password/password.component';
import { PasswordComponentModule } from './components/misc/password/password.module';

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
    SelectAvatarComponent,
    // PasswordComponent, // ??
    AddUpdateStarObjectComponent,
    MakeDonationComponent,
    AppUpdateDonationGoalComponent,
    JoinSupporterComponent,
    // SystemMapListTagsComponent
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
    PasswordComponentModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [
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
     // this can sometimes suppress issues.
     // if there is a component not appearing or other related issues try comment this out
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
