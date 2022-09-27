import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './layouts/content/content.component';
import { FullComponent } from './layouts/full/full.component';

const routes: Routes = [
  { path: 'admin', component: FullComponent, loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule) },
  { path: 'auth', component: ContentComponent, loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
  { path: '', redirectTo: 'admin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
