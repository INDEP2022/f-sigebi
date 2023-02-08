/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DEPOSITARY_ROUTES_1_ROUTING } from './depositary-routes-1';
import { DEPOSITARY_ROUTES_2_ROUTING } from './depositary-routes-2';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  ...DEPOSITARY_ROUTES_1_ROUTING,
  ...DEPOSITARY_ROUTES_2_ROUTING,
  // DEPOSITARIA

  // PROCESO DE DISPERCION DE PAGOS
  {
    path: 'payment-dispersion-process',
    loadChildren: async () =>
      (
        await import(
          './payment-dispersal-process/payment-dispersal-process.module'
        )
      ).PaymentDispersalProcessModule,
    data: { title: 'Proceso de Disperción de Pagos' },
  },

  // PROCESO DE DISPERCION DE PAGOS
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositaryRoutingModule {}
