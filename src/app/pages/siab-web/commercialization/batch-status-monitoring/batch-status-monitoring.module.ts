import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { BatchStatusMonitoringRoutingModule } from './batch-status-monitoring-routing.module';
import { BatchStatusMonitoringComponent } from './batch-status-monitoring/batch-status-monitoring.component';

@NgModule({
  declarations: [BatchStatusMonitoringComponent],
  imports: [CommonModule, BatchStatusMonitoringRoutingModule, SharedModule],
})
export class BatchStatusMonitoringModule {}
