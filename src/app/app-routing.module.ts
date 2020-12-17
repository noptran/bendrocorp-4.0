import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
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
    loadChildren: () => import('./pages/events/events.module').then( m => m.EventsPageModule)
  },
  {
    path: 'job-board',
    loadChildren: () => import('./pages/job/job.module').then( m => m.JobPageModule)
  },
  {
    path: 'flight-logs',
    loadChildren: () => import('./pages/flight-logs/flight-logs.module').then( m => m.FlightLogsPageModule)
  },
  {
    path: 'forms',
    loadChildren: () => import('./pages/forms/forms.module').then( m => m.FormsPageModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages/pages.module').then( m => m.PagesPageModule)
  },
  {
    path: 'alerts',
    loadChildren: () => import('./pages/alerts/alerts.module').then( m => m.AlertsPageModule)
  },
  {
    path: 'offender-reports',
    loadChildren: () => import('./pages/offender-reports/offender-reports.module').then( m => m.OffenderReportsPageModule)
  },
  {
    path: 'system-map',
    loadChildren: () => import('./pages/system-map/system-map.module').then( m => m.SystemMapPageModule)
  },
  {
    path: 'approvals',
    loadChildren: () => import('./pages/approval/approval.module').then( m => m.ApprovalPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
