/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { DocumentVerificationRevisionResourcesComponent } from './document-verification-revision-resources/document-verification-revision-resources.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentVerificationRevisionResourcesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentVerificationRevisionResourcesRoutingModule {}
