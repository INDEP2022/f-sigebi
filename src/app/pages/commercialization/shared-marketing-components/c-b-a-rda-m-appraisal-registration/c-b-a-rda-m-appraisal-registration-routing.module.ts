import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBARdaCAppraisalRegistrationComponent } from './c-b-a-rda-c-appraisal-registration/c-b-a-rda-c-appraisal-registration.component';

const routes: Routes = [
  {
    path: '',
    component: CBARdaCAppraisalRegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBARdaMAppraisalRegistrationRoutingModule {}
