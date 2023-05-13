/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { MonitorReturnAbandonmentRoutingModule } from './monitor-return-abandonment-routing.module';

/** COMPONENTS IMPORTS */
import { InputTableComponent } from './input-table/input-table.component';
import { MonitorReturnAbandonmentComponent } from './monitor-return-abandonment/monitor-return-abandonment.component';

@NgModule({
  declarations: [MonitorReturnAbandonmentComponent, InputTableComponent],
  imports: [CommonModule, MonitorReturnAbandonmentRoutingModule, SharedModule],
})
export class MonitorReturnAbandonmentModule {}
