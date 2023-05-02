/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { VerificationDocumentsConfiscationComponent } from './verification-documents-confiscation/verification-documents-confiscation.component';

const routes: Routes = [
  {
    path: '',
    component: VerificationDocumentsConfiscationComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificationDocumentsConfiscationRoutingModule {}
