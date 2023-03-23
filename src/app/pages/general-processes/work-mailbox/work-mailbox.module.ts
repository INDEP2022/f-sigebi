import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
//@Standalone Components
import { ManagementAreaSharedComponent } from 'src/app/@standalone/shared-forms/management-area-shared/management-area-shared.component';

import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MailboxModalTableComponent } from './components/mailbox-modal-table/mailbox-modal-table.component';
import { WorkMailboxRoutingModule } from './work-mailbox-routing.module';
import { WorkMailboxComponent } from './work-mailbox/work-mailbox.component';

@NgModule({
  declarations: [WorkMailboxComponent, MailboxModalTableComponent],
  imports: [
    CommonModule,
    WorkMailboxRoutingModule,
    SharedModule,
    ManagementAreaSharedComponent,
    PreviewDocumentsComponent,
    DocumentsViewerByFolioComponent,
  ],
})
export class WorkMailboxModule {}
