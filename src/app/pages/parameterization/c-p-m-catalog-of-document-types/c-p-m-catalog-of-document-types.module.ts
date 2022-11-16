import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPCdtCCatalogOfDocumentTypesComponent } from './c-p-cdt-c-catalog-of-document-types/c-p-cdt-c-catalog-of-document-types.component';
import { CPMCatalogOfDocumentTypesRoutingModule } from './c-p-m-catalog-of-document-types-routing.module';
import { ModalCatalogOfDocumentTypesComponent } from './modal-catalog-of-document-types/modal-catalog-of-document-types.component';

@NgModule({
  declarations: [
    CPCdtCCatalogOfDocumentTypesComponent,
    ModalCatalogOfDocumentTypesComponent,
  ],
  imports: [
    CommonModule,
    CPMCatalogOfDocumentTypesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMCatalogOfDocumentTypesModule {}
