import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogOfDocumentTypesRoutingModule } from './catalog-of-document-types-routing.module';
import { CatalogOfDocumentTypesComponent } from './catalog-of-document-types/catalog-of-document-types.component';
import { ModalCatalogOfDocumentTypesComponent } from './modal-catalog-of-document-types/modal-catalog-of-document-types.component';

@NgModule({
  declarations: [
    CatalogOfDocumentTypesComponent,
    ModalCatalogOfDocumentTypesComponent,
  ],
  imports: [
    CommonModule,
    CatalogOfDocumentTypesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CatalogOfDocumentTypesModule {}
