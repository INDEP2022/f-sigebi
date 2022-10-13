import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBACdaCAppraisalConsultationComponent } from './c-b-a-cda-c-appraisal-consultation/c-b-a-cda-c-appraisal-consultation.component';

const routes: Routes = [
  {
    path: '',
    component: CBACdaCAppraisalConsultationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBACdaMAppraisalConsultationRoutingModule {}
