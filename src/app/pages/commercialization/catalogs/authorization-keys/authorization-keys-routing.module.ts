import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationKeysComponent } from './authorization-keys/authorization-keys.component';

const routes: Routes = [
  {
    path: '',
    component: AuthorizationKeysComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizationKeysRoutingModule {}
