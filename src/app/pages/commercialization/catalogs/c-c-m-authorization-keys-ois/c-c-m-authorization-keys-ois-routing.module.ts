import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCCaeeoCAuthorizationKeysFormComponent } from './c-c-caeeo-c-authorization-keys-form/c-c-caeeo-c-authorization-keys-form.component';

const routes: Routes = [
  {
    path: '',
    component: CCCaeeoCAuthorizationKeysFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCMAuthorizationKeysOisRoutingModule {}
