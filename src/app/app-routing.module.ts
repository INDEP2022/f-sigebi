import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ContentComponent } from './layouts/content/content.component';
import { FullComponent } from './layouts/full/full.component';

const routes: Routes = [
  {
    path: 'auth',
    component: ContentComponent,
    loadChildren: async () =>
      (await import('./pages/auth/auth.module')).AuthModule,
  },
  {
    path: 'pages',
    component: FullComponent,
    loadChildren: async () =>
      (await import('./pages/pages.module')).PagesModule,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  { path: 'jprConfiscatedReception', loadChildren: () => import('./pages/judicial-physical-reception/jpr-confiscated-reception/jpr-confiscated-reception.module').then(m => m.JprConfiscatedReceptionModule) },
  { path: 'jprRecordsReport', loadChildren: () => import('./pages/judicial-physical-reception/jpr-records-report/jpr-records-report.module').then(m => m.JprRecordsReportModule) },
  { path: 'jprConfiscatedRecords', loadChildren: () => import('./pages/judicial-physical-reception/jpr-confiscated-records/jpr-confiscated-records.module').then(m => m.JprConfiscatedRecordsModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
