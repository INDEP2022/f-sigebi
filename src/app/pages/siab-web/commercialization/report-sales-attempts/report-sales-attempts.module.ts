import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReportSalesAttemptsRoutingModule } from './report-sales-attempts-routing.module';
import { ReportSalesAttemptsComponent } from './report-sales-attempts/report-sales-attempts.component';

@NgModule({
  declarations: [ReportSalesAttemptsComponent],
  imports: [CommonModule, ReportSalesAttemptsRoutingModule, SharedModule],
})
export class ReportSalesAttemptsModule {}
