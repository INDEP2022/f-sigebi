import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisposalRecordReportComponent } from './disposal-record-report/disposal-record-report.component';

const routes: Routes = [
  {
    path: '',
    component: DisposalRecordReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisposalRecordReportRoutingModule {}
