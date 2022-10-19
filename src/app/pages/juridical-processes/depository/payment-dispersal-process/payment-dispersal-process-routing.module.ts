/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { routesJuridicalProcesses } from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  // PROCESO DE DISPERCION DE PAGOS
  {
    path: routesJuridicalProcesses[5].link,
    loadChildren: async () =>
      (
        await import(
          './conciliation-depositary-payments/pj-d-pdp-m-conciliation-depositary-payments.module'
        )
      ).PJDPDPConciliationDepositaryPaymentsModule,
    data: { title: routesJuridicalProcesses[5].label },
  },
  {
    path: routesJuridicalProcesses[6].link,
    loadChildren: async () =>
      (
        await import(
          './query-related-payments-depositories/pj-d-pdp-m-query-related-payments-depositories.module'
        )
      ).PJDPDPQueryRelatedPaymentsDepositoriesModule,
    data: { title: routesJuridicalProcesses[6].label },
  },
  // PROCESO DE DISPERCION DE PAGOS
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentDispersalProcessRoutingModule {}
