import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { reportBatchesPendingRoutingModule } from './report-batches-pending-routing.module';
import { reportBatchesPendingComponent } from './report-batches-pending/report-batches-pending.component';

@NgModule({
  declarations: [reportBatchesPendingComponent],
  imports: [CommonModule, reportBatchesPendingRoutingModule, SharedModule],
})
export class reportBatchesPendingModule {}
