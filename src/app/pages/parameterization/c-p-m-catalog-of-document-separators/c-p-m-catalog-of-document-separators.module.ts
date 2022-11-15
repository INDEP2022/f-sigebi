import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPCdsCCatalogOfDocumentSeparatorsComponent } from './c-p-cds-c-catalog-of-document-separators/c-p-cds-c-catalog-of-document-separators.component';
import { CPMCatalogOfDocumentSeparatorsRoutingModule } from './c-p-m-catalog-of-document-separators-routing.module';
import { ModalCatalogOfDocumentSeparatorsComponent } from './modal-catalog-of-document-separators/modal-catalog-of-document-separators.component';

@NgModule({
  declarations: [
    CPCdsCCatalogOfDocumentSeparatorsComponent,
    ModalCatalogOfDocumentSeparatorsComponent,
  ],
  imports: [
    CommonModule,
    CPMCatalogOfDocumentSeparatorsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMCatalogOfDocumentSeparatorsModule {}
