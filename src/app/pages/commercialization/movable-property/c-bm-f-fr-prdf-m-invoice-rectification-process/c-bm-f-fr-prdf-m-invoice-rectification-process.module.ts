import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';

import { CBmFFrPrdfCInvoiceRectificationProcessComponent } from './c-bm-f-fr-prdf-c-invoice-rectification-process/c-bm-f-fr-prdf-c-invoice-rectification-process.component';
import { CBmFFrPrdfCNewImageModalComponent } from './c-bm-f-fr-prdf-c-new-image-modal/c-bm-f-fr-prdf-c-new-image-modal.component';
import { CBmFFrPrdfMInvoiceRectificationProcessRoutingModule } from './c-bm-f-fr-prdf-m-invoice-rectification-process-routing.module';

@NgModule({
  declarations: [
    CBmFFrPrdfCInvoiceRectificationProcessComponent,
    CBmFFrPrdfCNewImageModalComponent,
  ],
  imports: [
    CommonModule,
    CBmFFrPrdfMInvoiceRectificationProcessRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    PreviewDocumentsComponent,
    UsersSharedComponent,
  ],
})
export class CBmFFrPrdfMInvoiceRectificationProcessModule {}
