import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpDocumentsViewerRoutingModule } from './gp-documents-viewer-routing.module';
import { GpDocumentsViewerComponent } from './gp-documents-viewer/gp-documents-viewer.component';

@NgModule({
  declarations: [GpDocumentsViewerComponent],
  imports: [CommonModule, GpDocumentsViewerRoutingModule, SharedModule],
})
export class GpDocumentsViewerModule {}
