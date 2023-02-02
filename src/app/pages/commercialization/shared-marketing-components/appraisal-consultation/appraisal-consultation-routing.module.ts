import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppraisalConsultationComponent } from './appraisal-consultation/appraisal-consultation.component';

const routes: Routes = [
  {
    path: '',
    component: AppraisalConsultationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalConsultationRoutingModule {}
