import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BatchStatusMonitoringRoutingModule } from './batch-status-monitoring-routing.module';
import { BatchStatusMonitoringComponent } from './batch-status-monitoring/batch-status-monitoring.component';

@NgModule({
  declarations: [BatchStatusMonitoringComponent],
  imports: [
    CommonModule,
    BatchStatusMonitoringRoutingModule,
    SharedModule,
    TooltipModule.forRoot(),
    ModalModule.forChild(),
  ],
})
export class BatchStatusMonitoringModule {}
