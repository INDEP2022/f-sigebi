/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
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
export class ApproveReturnRequestRoutingModule {}
