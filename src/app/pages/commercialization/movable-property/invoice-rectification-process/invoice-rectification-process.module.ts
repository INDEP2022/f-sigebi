import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';

import { InvoiceRectificationProcessRoutingModule } from './invoice-rectification-process-routing.module';
import { InvoiceRectificationProcessComponent } from './invoice-rectification-process/invoice-rectification-process.component';
import { NewImageModalComponent } from './new-image-modal/new-image-modal.component';

@NgModule({
  declarations: [InvoiceRectificationProcessComponent, NewImageModalComponent],
  imports: [
    CommonModule,
    InvoiceRectificationProcessRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    PreviewDocumentsComponent,
    UsersSharedComponent,
  ],
})
export class InvoiceRectificationProcessModule {}
