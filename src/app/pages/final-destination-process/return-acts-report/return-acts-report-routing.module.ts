import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnActsReportComponent } from './return-acts-report/return-acts-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReturnActsReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnActsReportRoutingModule {}
