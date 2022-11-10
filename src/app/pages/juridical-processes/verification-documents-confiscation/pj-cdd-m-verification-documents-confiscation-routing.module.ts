/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJCDDVerificationDocumentsConfiscationComponent } from './verification-documents-confiscation/pj-cdd-c-verification-documents-confiscation.component';

const routes: Routes = [
  {
    path: '',
    component: PJCDDVerificationDocumentsConfiscationComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJCDDVerificationDocumentsConfiscationRoutingModule {}
