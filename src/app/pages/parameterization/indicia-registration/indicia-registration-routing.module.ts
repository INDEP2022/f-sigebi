import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndiciaRegistrationComponent } from './indicia-registration/indicia-registration.component';

const routes: Routes = [
  {
    path: '',
    component: IndiciaRegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndiciaRegistrationRoutingModule {}
