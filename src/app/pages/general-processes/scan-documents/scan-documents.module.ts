import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { TiffViewerComponent } from 'src/app/@standalone/tiff-viewer/tiff-viewer.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentsScanComponent } from './documents-scan/documents-scan.component';
import { ScanDocumentsRoutingModule } from './scan-documents-routing.module';

@NgModule({
  declarations: [DocumentsScanComponent],
  imports: [
    CommonModule,
    ScanDocumentsRoutingModule,
    SharedModule,
    TiffViewerComponent,
    FileUploadModalComponent,
  ],
})
export class ScanDocumentsModule {}
