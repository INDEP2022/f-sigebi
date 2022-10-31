/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJMonitorReturnAbandonmentRoutingModule } from './pj-m-monitor-return-abandonment-routing.module';

/** COMPONENTS IMPORTS */
import { PJMonitorReturnAbandonmentComponent } from './monitor-return-abandonment/pj-c-monitor-return-abandonment.component';

@NgModule({
  declarations: [PJMonitorReturnAbandonmentComponent],
  imports: [
    CommonModule,
    PJMonitorReturnAbandonmentRoutingModule,
    SharedModule,
  ],
})
export class PJMonitorReturnAbandonmentModule {}
