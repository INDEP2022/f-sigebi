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
    path: 'registrar-documentacion-devolucion',
    loadChildren: async () =>
      (
        await import(
          './register-document-return/register-document-return.module'
        )
      ).GDRSDRegisterDocumentReturnModule,
    data: { title: 'Registrar Documentación Complementaria Devolución' },
  },
  // Registrar Documentación Complementaria Devolución
  // registro de solicitud de devolucion
  {
    path: 'registro-solicitud-devolucion',
    loadChildren: async () =>
      (
        await import(
          './return-request-record/gd-rsd-m-return-request-record.module'
        )
      ).GDRSDReturnRequestRecordModule,
    data: { title: 'Registro de Solicitud de Devolución' },
  },
  // registro de solicitud de devolucion
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GDReturnRequestRegistrationRoutingModule {}
