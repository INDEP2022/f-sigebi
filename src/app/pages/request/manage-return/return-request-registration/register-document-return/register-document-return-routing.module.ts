/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterDocumentReturnComponent } from './register-document-return/register-document-return.component';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  {
    path: '',
    component: RegisterDocumentReturnComponent,
    data: {
      title: 'Registrar Documentación Complementaria Devolución',
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterDocumentReturnRoutingModule {}
