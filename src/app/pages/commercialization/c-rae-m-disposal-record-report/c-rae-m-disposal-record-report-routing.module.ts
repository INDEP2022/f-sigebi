import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRaeCDisposalRecordReportComponent } from './c-rae-c-disposal-record-report/c-rae-c-disposal-record-report.component';

const routes: Routes = [
  {
    path: '',
    component: CRaeCDisposalRecordReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CRaeMDisposalRecordReportRoutingModule {}
