/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJReturnAbandonmentMonitorRoutingModule } from './pj-m-return-abandonment-monitor-routing.module';

/** COMPONENTS IMPORTS */
import { PJReturnAbandonmentMonitorComponent } from './return-abandonment-monitor/pj-c-return-abandonment-monitor.component';

@NgModule({
  declarations: [PJReturnAbandonmentMonitorComponent],
  imports: [
    CommonModule,
    PJReturnAbandonmentMonitorRoutingModule,
    SharedModule,
  ],
})
export class PJReturnAbandonmentMonitorModule {}
