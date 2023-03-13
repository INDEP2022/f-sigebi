import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ScanDocumentsComponent } from './components/scan-documents/scan-documents.component';
import { ScanRequestRoutingModule } from './scan-request-routing.module';
import { ScanRequestComponent } from './scan-request/scan-request.component';

@NgModule({
  declarations: [ScanRequestComponent, ScanDocumentsComponent],
  imports: [CommonModule, ScanRequestRoutingModule, SharedModule],
})
export class ScanRequestModule {}
