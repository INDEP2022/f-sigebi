/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDDocumentVerificationRevisionResourcesComponent } from './document-verification-revision-resources/pj-d-c-document-verification-revision-resources.component';

const routes: Routes = [
  {
    path: '',
    component: PJDDocumentVerificationRevisionResourcesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDDocumentVerificationRevisionResourcesRoutingModule {}
