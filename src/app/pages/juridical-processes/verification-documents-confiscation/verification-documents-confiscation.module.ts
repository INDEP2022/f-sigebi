/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { VerificationDocumentsConfiscationRoutingModule } from './verification-documents-confiscation-routing.module';

/** COMPONENTS IMPORTS */
import { VerificationDocumentsConfiscationComponent } from './verification-documents-confiscation/verification-documents-confiscation.component';

@NgModule({
  declarations: [VerificationDocumentsConfiscationComponent],
  imports: [
    CommonModule,
    VerificationDocumentsConfiscationRoutingModule,
    SharedModule,
  ],
})
export class VerificationDocumentsConfiscationModule {}
