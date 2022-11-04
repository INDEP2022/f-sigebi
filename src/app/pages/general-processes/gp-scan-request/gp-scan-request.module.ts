import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpScanDocumentsComponent } from './components/gp-scan-documents/gp-scan-documents.component';
import { GpScanRequestRoutingModule } from './gp-scan-request-routing.module';
import { GpScanRequestComponent } from './gp-scan-request/gp-scan-request.component';

@NgModule({
  declarations: [GpScanRequestComponent, GpScanDocumentsComponent],
  imports: [CommonModule, GpScanRequestRoutingModule, SharedModule],
})
export class GpScanRequestModule {}
