/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { SharedJuridicalProcessesModule } from '../../../shared-juridical-processes/shared-juridical-processes.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { ConciliationDepositaryPaymentsRoutingModule } from './conciliation-depositary-payments-routing.module';

/** COMPONENTS IMPORTS */
import { ConciliationDepositaryPaymentsComponent } from './conciliation-depositary-payments/conciliation-depositary-payments.component';

@NgModule({
  declarations: [ConciliationDepositaryPaymentsComponent],
  imports: [
    CommonModule,
    ConciliationDepositaryPaymentsRoutingModule,
    SharedModule,
    SharedJuridicalProcessesModule,
  ],
})
export class ConciliationDepositaryPaymentsModule {}
