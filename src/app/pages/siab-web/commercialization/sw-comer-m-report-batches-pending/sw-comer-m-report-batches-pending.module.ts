import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { SwComerCReportBatchesPendingComponent } from './sw-comer-c-report-batches-pending/sw-comer-c-report-batches-pending.component';
import { SwComerMReportBatchesPendingRoutingModule } from './sw-comer-m-report-batches-pending-routing.module';

@NgModule({
  declarations: [SwComerCReportBatchesPendingComponent],
  imports: [
    CommonModule,
    SwComerMReportBatchesPendingRoutingModule,
    SharedModule,
  ],
})
export class SwComerMReportBatchesPendingModule {}
