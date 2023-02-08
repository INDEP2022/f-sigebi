import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentsViewerRoutingModule } from './documents-viewer-routing.module';
import { DocumentsViewerComponent } from './documents-viewer/documents-viewer.component';

@NgModule({
  declarations: [DocumentsViewerComponent],
  imports: [CommonModule, DocumentsViewerRoutingModule, SharedModule],
})
export class DocumentsViewerModule {}
