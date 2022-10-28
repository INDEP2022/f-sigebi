/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { routesJuridicalProcesses } from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  {
    path: routesJuridicalProcesses[0].link + '/:id',
    loadChildren: async () =>
      (await import('./juridical-ruling/pj-dj-m-juridical-ruling.module'))
        .PJDJJuridicalRulingModule,
    data: { title: routesJuridicalProcesses[0].label },
  },
  {
    path: routesJuridicalProcesses[1].link + '/:id',
    loadChildren: async () =>
      (await import('./file-data-update/pj-ade-m-file-data-update.module'))
        .PJADEFileDataUpdateModule,
    data: { title: routesJuridicalProcesses[1].label },
  },
  {
    path: routesJuridicalProcesses[2].link,
    loadChildren: async () =>
      (
        await import(
          './notification-file-update/pj-aen-m-notification-file-update.module'
        )
      ).PJAENNotificationFileUpdateModule,
    data: { title: routesJuridicalProcesses[2].label },
  },
  {
    path: routesJuridicalProcesses[3].link,
    loadChildren: async () =>
      (
        await import(
          './abandonments-declaration-trades/pj-a-m-abandonments-declaration-trades.module'
        )
      ).PJAAbandonmentsDeclarationTradesModule,
    data: { title: routesJuridicalProcesses[3].label },
  },
  {
    path: routesJuridicalProcesses[4].link,
    loadChildren: async () =>
      (
        await import(
          './goods-process-validation-extdom/pj-bvae-m-goods-process-validation-extdom.module'
        )
      ).PJBVAEGoodsProcessValidationExtdomModule,
    data: { title: routesJuridicalProcesses[4].label },
  },
  // DEPOSITARIA
  {
    path: 'depositaria',
    loadChildren: async () =>
      (await import('./depositary/depositary.module')).DepositaryModule,
    data: { title: 'Depositoria' },
  },
  // DEPOSITARIA
  // FORMALIZACION INMUEBLES
  {
    path: 'formalizacion-inmuebles',
    loadChildren: async () =>
      (await import('./formalization-property/formalization-property.module'))
        .PaymentDispersalProcessModule,
    data: { title: 'Formalización de Inmuebles' },
  },
  // FORMALIZACION INMUEBLES
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuridicalProcessesRoutingModule {}
