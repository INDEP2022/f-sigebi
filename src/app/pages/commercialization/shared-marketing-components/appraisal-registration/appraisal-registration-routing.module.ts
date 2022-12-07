import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppraisalRegistrationComponent } from './appraisal-registration/appraisal-registration.component';

const routes: Routes = [
  {
    path: '',
    component: AppraisalRegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalRegistrationRoutingModule {}
