import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsReportComponent } from './records-report.component';

const routes: Routes = [{ path: '', component: RecordsReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsReportRoutingModule {}
