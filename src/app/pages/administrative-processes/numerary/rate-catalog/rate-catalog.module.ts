import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RateCatalogRoutingModule } from './rate-catalog-routing.module';
import { RateCatalogComponent } from './rate-catalog/rate-catalog.component';

@NgModule({
  declarations: [RateCatalogComponent],
  imports: [
    CommonModule,
    RateCatalogRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    TabsModule,
    PreviewDocumentsComponent,
  ],
})
export class RateCatalogModule {}
