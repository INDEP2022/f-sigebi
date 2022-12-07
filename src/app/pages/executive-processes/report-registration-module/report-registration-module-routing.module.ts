import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportRegistrationModuleComponent } from './report-registration-module/report-registration-module.component';

const routes: Routes = [
  {
    path: '',
    component: ReportRegistrationModuleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRegistrationModuleRoutingModule {}
