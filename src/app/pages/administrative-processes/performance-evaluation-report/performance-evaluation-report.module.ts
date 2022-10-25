import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { PerformanceEvaluationReportRoutingModule } from './performance-evaluation-report-routing.module';
import { PerformanceEvaluationReportComponent } from './performance-evaluation-report/performance-evaluation-report.component';

@NgModule({
  declarations: [PerformanceEvaluationReportComponent],
  imports: [
    CommonModule,
    PerformanceEvaluationReportRoutingModule,
    SharedModule,
  ],
})
export class PerformanceEvaluationReportModule {}
