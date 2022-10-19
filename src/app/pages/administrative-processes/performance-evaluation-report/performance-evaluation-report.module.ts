import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceEvaluationReportRoutingModule } from './performance-evaluation-report-routing.module';
import { PerformanceEvaluationReportComponent } from './performance-evaluation-report/performance-evaluation-report.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PerformanceEvaluationReportComponent
  ],
  imports: [
    CommonModule,
    PerformanceEvaluationReportRoutingModule,
    SharedModule,
  ]
})
export class PerformanceEvaluationReportModule { }
