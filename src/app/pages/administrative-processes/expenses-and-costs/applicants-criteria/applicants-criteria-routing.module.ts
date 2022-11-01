import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicantsCriteriaComponent } from './applicants-criteria/applicants-criteria.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicantsCriteriaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicantsCriteriaRoutingModule {}
