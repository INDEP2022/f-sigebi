/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { GDRSDRegisterDocumentReturnRoutingModule } from './register-document-return-routing.module';

/** COMPONENTS IMPORTS */
import { GDRSDRegisterDocumentReturnComponent } from './register-document-return/gd-rsd-c-register-document-return.component';

@NgModule({
  declarations: [GDRSDRegisterDocumentReturnComponent],
  imports: [
    CommonModule,
    GDRSDRegisterDocumentReturnRoutingModule,
    SharedModule,
  ],
  providers: [],
})
export class GDRSDRegisterDocumentReturnModule {}
