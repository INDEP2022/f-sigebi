import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentsViewerRoutingModule } from './documents-viewer-routing.module';
import { DocumentViewerFormComponent } from './documents-viewer/documents-viewer-form/documents-viewer-form.component';
import { DocumentsViewerComponent } from './documents-viewer/documents-viewer.component';
// import { MailboxModalTableComponent } from './documents-viewer/mailbox-modal-table/mailbox-modal-table.component';

@NgModule({
  declarations: [DocumentsViewerComponent, DocumentViewerFormComponent],
  // declarations: [DocumentsViewerComponent, DocumentViewerFormComponent, MailboxModalTableComponent],
  imports: [
    CommonModule,
    DocumentsViewerRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class DocumentsViewerModule {}
