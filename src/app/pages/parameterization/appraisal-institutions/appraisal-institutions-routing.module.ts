import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppraisalInstitutionsComponent } from './appraisal-institutions/appraisal-institutions.component';

const routes: Routes = [
  {
    path: '',
    component: AppraisalInstitutionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalInstitutionsRoutingModule {}
