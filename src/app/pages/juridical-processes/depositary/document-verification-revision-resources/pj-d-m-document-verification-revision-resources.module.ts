/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDDocumentVerificationRevisionResourcesRoutingModule } from './pj-d-m-document-verification-revision-resources-routing.module';

/** COMPONENTS IMPORTS */
import { PJDDocumentVerificationRevisionResourcesComponent } from './document-verification-revision-resources/pj-d-c-document-verification-revision-resources.component';

@NgModule({
  declarations: [PJDDocumentVerificationRevisionResourcesComponent],
  imports: [
    CommonModule,
    PJDDocumentVerificationRevisionResourcesRoutingModule,
    SharedModule,
  ],
})
export class PJDDocumentVerificationRevisionResourcesModule {}
