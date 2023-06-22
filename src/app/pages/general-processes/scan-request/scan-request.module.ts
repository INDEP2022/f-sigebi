import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { DocumentsTypeSharedComponent } from 'src/app/@standalone/shared-forms/documents-type-shared/documents-type-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CallScanDocumentComponent } from './call-scan-document/call-scan-document.component';
import { ScanDocumentsComponent } from './components/scan-documents/scan-documents.component';
import { ListDocumentsComponent } from './list-documents/list-documents.component';
import { ListNotificationsComponent } from './list-notifications/list-notifications.component';
import { ScanRequestRoutingModule } from './scan-request-routing.module';
import { ScanRequestComponent } from './scan-request/scan-request.component';

@NgModule({
  declarations: [
    ScanRequestComponent,
    ScanDocumentsComponent,
    ListNotificationsComponent,
    ListDocumentsComponent,
    CallScanDocumentComponent,
  ],
  imports: [
    CommonModule,
    ScanRequestRoutingModule,
    SharedModule,
    DocumentsTypeSharedComponent,
    FormLoaderComponent,
    TooltipModule.forRoot(),
  ],
})
export class ScanRequestModule {}
