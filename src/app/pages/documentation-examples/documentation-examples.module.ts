/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { DocumentationExamplesRoutingModule } from './documentation-examples-routing.module';

/** COMPONENTS IMPORTS */
import { DocumentationExamplesComponent } from './base-page-documentation/documentation-examples.component';

/** IMPORT COMPONENTS DOCUMENTATION */
export const declarationsComponents: any[] = [DocumentationExamplesComponent];

@NgModule({
  declarations: [declarationsComponents],
  imports: [CommonModule, DocumentationExamplesRoutingModule, SharedModule],
})
export class DocumentationExamplesModule {}
