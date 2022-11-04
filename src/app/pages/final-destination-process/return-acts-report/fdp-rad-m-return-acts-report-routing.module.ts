import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpRadCReturnActsReportComponent } from './return-acts-report/fdp-rad-c-return-acts-report.component';

const routes: Routes = [
  {
    path: '',
    component: FdpRadCReturnActsReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpRadMReturnActsReportRoutingModule {}
