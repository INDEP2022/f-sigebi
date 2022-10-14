/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDPDPConciliationDepositaryPaymentsComponent } from './conciliation-depositary-payments/pj-d-pdp-c-conciliation-depositary-payments.component';

const routes: Routes = [
  {
    path: '',
    component: PJDPDPConciliationDepositaryPaymentsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDPDPConciliationDepositaryPaymentsRoutingModule {}
