import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrDocumentsRequirementsVerificationRoutingModule } from './dr-documents-requirements-verification-routing.module';
import { DrDocumentsRequirementsVerificationComponent } from './dr-documents-requirements-verification/dr-documents-requirements-verification.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DrDocumentsRequirementsVerificationComponent],
  imports: [
    CommonModule,
    DrDocumentsRequirementsVerificationRoutingModule,
    SharedModule,
  ],
})
export class DrDocumentsRequirementsVerificationModule {}
