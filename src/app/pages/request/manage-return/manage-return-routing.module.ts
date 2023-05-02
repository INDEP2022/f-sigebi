/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  // registro de solicitud de devolucion
  {
    path: 'return-request-registration',
    loadChildren: async () =>
      (
        await import(
          './return-request-registration/return-request-registration.module'
        )
      ).ReturnRequestRegistrationModule,
    data: { title: 'Registro de Solicitud de Devolución' },
  },
  // registro de solicitud de devolucion
  // Clasificación de Bienes
  {
    path: 'goods-classification',
    loadChildren: async () =>
      (await import('./goods-classification/goods-classification.module'))
        .GoodsClassificationModule,
    data: { title: 'Clasificación de Bienes' },
  },
  // Clasificación de Bienes
  // Aprobar Solicitud de Devolución
  {
    path: 'approve-return-request',
    loadChildren: async () =>
      (await import('./approve-return-request/approve-return-request.module'))
        .ApproveReturnRequestModule,
    data: { title: 'Aprobar Solicitud de Devolución' },
  },
  // Aprobar Solicitud de Devolución
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageReturnRoutingModule {}
