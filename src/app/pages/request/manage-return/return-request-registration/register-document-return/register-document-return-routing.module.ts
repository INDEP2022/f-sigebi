/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GDRSDRegisterDocumentReturnComponent } from './register-document-return/gd-rsd-c-register-document-return.component';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  {
    path: '',
    component: GDRSDRegisterDocumentReturnComponent,
    data: {
      title: 'Registrar Documentación Complementaria Devolución',
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GDRSDRegisterDocumentReturnRoutingModule {}
