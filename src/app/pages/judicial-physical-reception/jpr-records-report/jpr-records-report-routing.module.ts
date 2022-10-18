import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JprRecordsReportComponent } from './jpr-records-report.component';

const routes: Routes = [{ path: '', component: JprRecordsReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JprRecordsReportRoutingModule { }
