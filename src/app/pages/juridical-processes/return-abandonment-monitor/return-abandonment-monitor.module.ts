/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { ReturnAbandonmentMonitorRoutingModule } from './return-abandonment-monitor-routing.module';

/** COMPONENTS IMPORTS */
import { ReturnAbandonmentMonitorComponent } from './return-abandonment-monitor/return-abandonment-monitor.component';

@NgModule({
  declarations: [ReturnAbandonmentMonitorComponent],
  imports: [CommonModule, ReturnAbandonmentMonitorRoutingModule, SharedModule],
})
export class ReturnAbandonmentMonitorModule {}
