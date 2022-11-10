import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPMAppraisalInstitutionsComponent } from './c-p-m-appraisal-institutions/c-p-m-appraisal-institutions.component';

const routes: Routes = [
  {
    path: '', component: CPMAppraisalInstitutionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CPMAppraisalInstitutionsRoutingModule { }
