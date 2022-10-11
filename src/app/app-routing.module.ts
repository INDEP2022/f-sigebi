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

  { path: 'experts', loadChildren: () => import('./pages/catalogs/experts/experts.module').then(m => m.ExpertsModule) },
  { path: 'persons', loadChildren: () => import('./pages/catalogs/persons/persons.module').then(m => m.PersonsModule) },
  { path: 'origin', loadChildren: () => import('./pages/catalogs/origin/origin.module').then(m => m.OriginModule) },
  { path: 'originCisi', loadChildren: () => import('./pages/catalogs/origin-cisi/origin-cisi.module').then(m => m.OriginCisiModule) },
  { path: 'siseProcess', loadChildren: () => import('./pages/catalogs/sise-process/sise-process.module').then(m => m.SiseProcessModule) },
  { path: 'rAsuntDic', loadChildren: () => import('./pages/catalogs/rasunt-dic/rasunt-dic.module').then(m => m.RAsuntDicModule) },
  { path: 'rack', loadChildren: () => import('./pages/catalogs/rack/rack.module').then(m => m.RackModule) },
  { path: 'regulatory', loadChildren: () => import('./pages/catalogs/regulatory/regulatory.module').then(m => m.RegulatoryModule) },
  { path: 'responseRepuve', loadChildren: () => import('./pages/catalogs/response-repuve/response-repuve.module').then(m => m.ResponseRepuveModule) },
  { path: 'indicatorReport', loadChildren: () => import('./pages/catalogs/indicator-report/indicator-report.module').then(m => m.IndicatorReportModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
