import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
//@Standalone Components
import { ManagementAreaSharedComponent } from 'src/app/@standalone/shared-forms/management-area-shared/management-area-shared.component';

import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PgrFilesComponent } from 'src/app/@standalone/modals/pgr-files/pgr-files.component';
import { ScanDocumentsModalComponent } from 'src/app/@standalone/modals/scan-documents-modal/scan-documents-modal.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MailboxModalTableComponent } from './components/mailbox-modal-table/mailbox-modal-table.component';
import { ObservationsComponent } from './components/observations/observations.component';
import { SaveModalMailboxComponent } from './components/save-modal-mailbox/save-modal-mailbox.component';
import { TurnPaperworkComponent } from './components/turn-paperwork/turn-paperwork.component';
import { WorkMailboxRoutingModule } from './work-mailbox-routing.module';
import { WorkMailboxComponent } from './work-mailbox/work-mailbox.component';

@NgModule({
  declarations: [
    WorkMailboxComponent,
    MailboxModalTableComponent,
    TurnPaperworkComponent,
    ObservationsComponent,
    SaveModalMailboxComponent,
  ],
  imports: [
    CommonModule,
    WorkMailboxRoutingModule,
    SharedModule,
    ManagementAreaSharedComponent,
    PreviewDocumentsComponent,
    DocumentsViewerByFolioComponent,
    ScanDocumentsModalComponent,
    PgrFilesComponent,
  ],
})
export class WorkMailboxModule {}
