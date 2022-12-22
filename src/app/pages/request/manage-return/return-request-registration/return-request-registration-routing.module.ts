/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  // Registrar Documentación Complementaria Devolución
  {
    path: 'register-document-return',
    loadChildren: async () =>
      (
        await import(
          './register-document-return/register-document-return.module'
        )
      ).RegisterDocumentReturnModule,
    data: { title: 'Registrar Documentación Complementaria Devolución' },
  },
  // Registrar Documentación Complementaria Devolución
  // registro de solicitud de devolucion
  {
    path: 'return-request-record',
    loadChildren: async () =>
      (await import('./return-request-record/return-request-record.module'))
        .ReturnRequestRecordModule,
    data: { title: 'Registro de Solicitud de Devolución' },
  },
  // registro de solicitud de devolucion
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnRequestRegistrationRoutingModule {}
