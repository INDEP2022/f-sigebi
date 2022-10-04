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
    // canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
