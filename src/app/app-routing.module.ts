import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthGuard } from './auth.guard';
import { NoAuthGuard } from './no-auth.guard';
import { NotFoundPage } from './not-found/not-found.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'offline',
    loadChildren: () => import('./app-offline/app-offline.module').then( m => m.AppOfflinePageModule)
  },
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'register',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./pages/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'forgot-password',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'profiles',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profiles/profiles.module').then( m => m.ProfilesPageModule)
  },
  {
    path: 'events',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/events/events.module').then( m => m.EventsPageModule)
  },
  {
    path: 'job-board',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/job/job.module').then( m => m.JobPageModule)
  },
  {
    path: 'flight-logs',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/flight-logs/flight-logs.module').then( m => m.FlightLogsPageModule)
  },
  {
    path: 'forms',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/forms/forms.module').then( m => m.FormsPageModule)
  },
  {
    path: 'pages',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pages/pages.module').then( m => m.PagesPageModule)
  },
  {
    path: 'alerts',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/alerts/alerts.module').then( m => m.AlertsPageModule)
  },
  {
    path: 'offender-reports',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/offender-reports/offender-reports.module').then( m => m.OffenderReportsPageModule)
  },
  {
    path: 'system-map',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/system-map/system-map.module').then( m => m.SystemMapPageModule)
  },
  {
    path: 'approvals',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/approval/approval.module').then( m => m.ApprovalPageModule)
  },
  {
    path: 'funding',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/funding/funding.module').then( m => m.FundingPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }), // , enableTracing: true
    RouterModule.forChild([ // catch all our mistakes route provider
      {
          path: '**',
          component: NotFoundPage
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
