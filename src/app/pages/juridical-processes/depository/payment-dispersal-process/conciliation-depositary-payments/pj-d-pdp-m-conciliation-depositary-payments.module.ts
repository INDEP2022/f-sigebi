/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { SharedLegalProcessModule } from '../../../shared-legal-process/shared-legal-process.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDPDPConciliationDepositaryPaymentsRoutingModule } from './pj-d-pdp-m-conciliation-depositary-payments-routing.module';

/** COMPONENTS IMPORTS */
import { PJDPDPConciliationDepositaryPaymentsComponent } from './conciliation-depositary-payments/pj-d-pdp-c-conciliation-depositary-payments.component';

@NgModule({
  declarations: [
    PJDPDPConciliationDepositaryPaymentsComponent
  ],
  imports: [
    CommonModule,
    PJDPDPConciliationDepositaryPaymentsRoutingModule,
    SharedModule,
    SharedLegalProcessModule,
  ],
})
export class PJDPDPConciliationDepositaryPaymentsModule {}
