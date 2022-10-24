import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceEvaluationReportComponent } from './performance-evaluation-report/performance-evaluation-report.component';

const routes: Routes = [
  {
    path: '',
    component: PerformanceEvaluationReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceEvaluationReportRoutingModule {}
