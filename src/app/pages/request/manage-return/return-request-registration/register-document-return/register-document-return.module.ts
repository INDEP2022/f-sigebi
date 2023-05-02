/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { RegisterDocumentReturnRoutingModule } from './register-document-return-routing.module';

/** COMPONENTS IMPORTS */
import { RegisterDocumentReturnComponent } from './register-document-return/register-document-return.component';

@NgModule({
  declarations: [RegisterDocumentReturnComponent],
  imports: [CommonModule, RegisterDocumentReturnRoutingModule, SharedModule],
  providers: [],
})
export class RegisterDocumentReturnModule {}
