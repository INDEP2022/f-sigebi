import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { JpDDrmCDepositRequestMonitorComponent } from './jp-d-drm-c-deposit-request-monitor/jp-d-drm-c-deposit-request-monitor.component';
import { JpDMDepositRequestMonitorRoutingModule } from './jp-d-m-deposit-request-monitor-routing.module';

@NgModule({
  declarations: [JpDDrmCDepositRequestMonitorComponent],
  imports: [CommonModule, JpDMDepositRequestMonitorRoutingModule, SharedModule],
})
export class JpDMDepositRequestMonitorModule {}
