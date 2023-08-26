import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScannedDocumentsRoutingModule } from './scanned-documents-routing.module';
import { ScannedDocumentsComponent } from './scanned-documents/scanned-documents.component';

@NgModule({
  declarations: [ScannedDocumentsComponent],
  imports: [CommonModule, ScannedDocumentsRoutingModule, SharedModule],
})
export class ScannedDocumentsModule {}
