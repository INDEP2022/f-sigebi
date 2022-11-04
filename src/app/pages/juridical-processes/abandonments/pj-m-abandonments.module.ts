/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJAbandonmentsRoutingModule } from './pj-m-abandonments-routing.module';

/** COMPONENTS IMPORTS */
import { PJAbandonmentsComponent } from './abandonments/pj-c-abandonments.component';

@NgModule({
  declarations: [PJAbandonmentsComponent],
  imports: [CommonModule, PJAbandonmentsRoutingModule, SharedModule],
})
export class PJAbandonmentsModule {}
