/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DEPOSITARY_ROUTES_1 } from 'src/app/common/constants/juridical-processes/depositary-routes-1';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  // PROCESO DE DISPERCION DE PAGOS
  {
    path: DEPOSITARY_ROUTES_1[1].link,
    loadChildren: async () =>
      (
        await import(
          './conciliation-depositary-payments/pj-d-pdp-m-conciliation-depositary-payments.module'
        )
      ).PJDPDPConciliationDepositaryPaymentsModule,
    data: { title: DEPOSITARY_ROUTES_1[1].label },
  },
  {
    path: DEPOSITARY_ROUTES_1[2].link,
    loadChildren: async () =>
      (
        await import(
          './query-related-payments-depositories/pj-d-pdp-m-query-related-payments-depositories.module'
        )
      ).PJDPDPQueryRelatedPaymentsDepositoriesModule,
    data: { title: DEPOSITARY_ROUTES_1[2].label },
  },
  // PROCESO DE DISPERCION DE PAGOS
];
console.log(routes);
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentDispersalProcessRoutingModule {}
