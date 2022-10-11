/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { SharedLegalProcessModule } from '../../shared-legal-process/shared-legal-process.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDPDPQueryRelatedPaymentsDepositoriesRoutingModule } from './pj-d-pdp-m-query-related-payments-depositories-routing.module';

/** COMPONENTS IMPORTS */
import { PJDPDPQueryRelatedPaymentsDepositoriesComponent } from './query-related-payments-depositories/pj-d-pdp-c-query-related-payments-depositories.component';

@NgModule({
  declarations: [
    PJDPDPQueryRelatedPaymentsDepositoriesComponent
  ],
  imports: [
    CommonModule,
    PJDPDPQueryRelatedPaymentsDepositoriesRoutingModule,
    SharedModule,
    SharedLegalProcessModule
  ],
})
export class PJDPDPQueryRelatedPaymentsDepositoriesModule {}
