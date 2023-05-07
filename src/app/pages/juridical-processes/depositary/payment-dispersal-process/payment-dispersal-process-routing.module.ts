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
          './conciliation-depositary-payments/conciliation-depositary-payments.module'
        )
      ).ConciliationDepositaryPaymentsModule,
    data: { title: DEPOSITARY_ROUTES_1[1].label, screen: 'FCONDEPOCONCILPAG' },
  },
  // PROCESO DE DISPERCION DE PAGOS
  {
    path: DEPOSITARY_ROUTES_1[1].link + '/:id',
    loadChildren: async () =>
      (
        await import(
          './conciliation-depositary-payments/conciliation-depositary-payments.module'
        )
      ).ConciliationDepositaryPaymentsModule,
    data: { title: DEPOSITARY_ROUTES_1[1].label, screen: 'FCONDEPOCONCILPAG' },
  },
  {
    // VALIDACION DE PAGOS SIN PARAMETROS
    path: DEPOSITARY_ROUTES_1[2].link,
    loadChildren: async () =>
      (
        await import(
          './query-related-payments-depositories/query-related-payments-depositories.module'
        )
      ).QueryRelatedPaymentsDepositoriesModule,
    data: { title: DEPOSITARY_ROUTES_1[2].label, screen: 'FCONDEPODISPAGOS' },
  },
  {
    // VALIDACION DE PAGOS CON PARAMETROS
    path: DEPOSITARY_ROUTES_1[2].link + '/:id',
    loadChildren: async () =>
      (
        await import(
          './query-related-payments-depositories/query-related-payments-depositories.module'
        )
      ).QueryRelatedPaymentsDepositoriesModule,
    data: { title: DEPOSITARY_ROUTES_1[2].label, screen: 'FCONDEPODISPAGOS' },
  },
  // PROCESO DE DISPERCION DE PAGOS
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentDispersalProcessRoutingModule {}
