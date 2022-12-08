/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { DocumentVerificationRevisionResourcesRoutingModule } from './document-verification-revision-resources-routing.module';

/** COMPONENTS IMPORTS */
import { DocumentVerificationRevisionResourcesComponent } from './document-verification-revision-resources/document-verification-revision-resources.component';

@NgModule({
  declarations: [DocumentVerificationRevisionResourcesComponent],
  imports: [
    CommonModule,
    DocumentVerificationRevisionResourcesRoutingModule,
    SharedModule,
  ],
})
export class DocumentVerificationRevisionResourcesModule {}
