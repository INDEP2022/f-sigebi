/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJCDDVerificationDocumentsConfiscationRoutingModule } from './pj-cdd-m-verification-documents-confiscation-routing.module';

/** COMPONENTS IMPORTS */
import { PJCDDVerificationDocumentsConfiscationComponent } from './verification-documents-confiscation/pj-cdd-c-verification-documents-confiscation.component';

@NgModule({
  declarations: [PJCDDVerificationDocumentsConfiscationComponent],
  imports: [
    CommonModule,
    PJCDDVerificationDocumentsConfiscationRoutingModule,
    SharedModule,
  ],
})
export class PJCDDVerificationDocumentsConfiscationModule {}
