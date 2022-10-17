import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoliciesReportComponent } from './policies-report/policies-report.component';

const routes: Routes = [
  {
    path: '',
    component: PoliciesReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoliciesReportRoutingModule {}
