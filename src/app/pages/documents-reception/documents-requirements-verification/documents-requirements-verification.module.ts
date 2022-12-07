import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentsRequirementsVerificationRoutingModule } from './documents-requirements-verification-routing.module';
import { DocumentsRequirementsVerificationComponent } from './documents-requirements-verification/documents-requirements-verification.component';

@NgModule({
  declarations: [DocumentsRequirementsVerificationComponent],
  imports: [
    CommonModule,
    DocumentsRequirementsVerificationRoutingModule,
    SharedModule,
  ],
})
export class DocumentsRequirementsVerificationModule {}
