import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorReportListComponent } from './indicator-report-list/indicator-report-list.component';

const routes: Routes = [{ path: '', component: IndicatorReportListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorReportRoutingModule {}
