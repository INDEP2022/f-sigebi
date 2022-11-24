import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { LoanMonitorRoutingModule } from './loan-monitor-routing.module';
import { LoanMonitorComponent } from './loan-monitor/loan-monitor.component';

@NgModule({
  declarations: [LoanMonitorComponent],
  imports: [
    CommonModule,
    LoanMonitorRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class LoanMonitorModule {}
