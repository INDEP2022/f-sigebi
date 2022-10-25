import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';

import { CBmFFrPrdfMInvoiceRectificationProcessRoutingModule } from './c-bm-f-fr-prdf-m-invoice-rectification-process-routing.module';
import { CBmFFrPrdfCInvoiceRectificationProcessComponent } from './c-bm-f-fr-prdf-c-invoice-rectification-process/c-bm-f-fr-prdf-c-invoice-rectification-process.component';
import { CBmFFrPrdfCNewImageModalComponent } from './c-bm-f-fr-prdf-c-new-image-modal/c-bm-f-fr-prdf-c-new-image-modal.component';


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
    PreviewDocumentsComponent 
  ]
})
export class CBmFFrPrdfMInvoiceRectificationProcessModule { }
