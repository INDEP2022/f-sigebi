/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { SharedJuridicalProcessesModule } from '../../../shared-juridical-processes/shared-juridical-processes.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDPDPConciliationDepositaryPaymentsRoutingModule } from './pj-d-pdp-m-conciliation-depositary-payments-routing.module';

/** COMPONENTS IMPORTS */
import { PJDPDPConciliationDepositaryPaymentsComponent } from './conciliation-depositary-payments/pj-d-pdp-c-conciliation-depositary-payments.component';

@NgModule({
  declarations: [PJDPDPConciliationDepositaryPaymentsComponent],
  imports: [
    CommonModule,
    PJDPDPConciliationDepositaryPaymentsRoutingModule,
    SharedModule,
    SharedJuridicalProcessesModule,
  ],
})
export class PJDPDPConciliationDepositaryPaymentsModule {}
