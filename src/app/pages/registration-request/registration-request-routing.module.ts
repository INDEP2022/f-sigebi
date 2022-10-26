import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationRequestFormComponent } from './registration-request-form/registration-request-form.component';

const routes: Routes = [
  {
    path: '',
    component: RegistrationRequestFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationRequestRoutingModule {}
