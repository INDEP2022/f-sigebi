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
  // registrar devolucion
  {
    path: 'registrar-devolucion',
    loadChildren: async () =>
      (await import('./register-return/register-return.module'))
        .GDRSDRegisterReturnModule,
    data: { title: 'Registrar Devolucion' },
  },
  // registrar devolucion
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GDReturnRequestRegistrationRoutingModule {}
