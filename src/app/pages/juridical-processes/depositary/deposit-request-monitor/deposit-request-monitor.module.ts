import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { DepositRequestMonitorRoutingModule } from './deposit-request-monitor-routing.module';
import { DepositRequestMonitorComponent } from './deposit-request-monitor/deposit-request-monitor.component';

@NgModule({
  declarations: [DepositRequestMonitorComponent],
  imports: [CommonModule, DepositRequestMonitorRoutingModule, SharedModule],
})
export class DepositRequestMonitorModule {}
