import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeIbsDACReportRegistrationModuleComponent } from './pe-ibs-d-a-c-report-registration-module/pe-ibs-d-a-c-report-registration-module.component';

const routes: Routes = [
  {
    path:'',
    component: PeIbsDACReportRegistrationModuleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeIbsDAMReportRegistrationModuleRoutingModule { }
