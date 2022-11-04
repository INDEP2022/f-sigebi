/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { SharedJuridicalProcessesModule } from '../../../shared-juridical-processes/shared-juridical-processes.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDPDPQueryRelatedPaymentsDepositoriesRoutingModule } from './pj-d-pdp-m-query-related-payments-depositories-routing.module';

/** COMPONENTS IMPORTS */
import { PJDPDPQueryRelatedPaymentsDepositoriesComponent } from './query-related-payments-depositories/pj-d-pdp-c-query-related-payments-depositories.component';

@NgModule({
  declarations: [PJDPDPQueryRelatedPaymentsDepositoriesComponent],
  imports: [
    CommonModule,
    PJDPDPQueryRelatedPaymentsDepositoriesRoutingModule,
    SharedModule,
    SharedJuridicalProcessesModule,
  ],
})
export class PJDPDPQueryRelatedPaymentsDepositoriesModule {}
