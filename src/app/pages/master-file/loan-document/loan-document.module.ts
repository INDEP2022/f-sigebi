import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoanDocumentRoutingModule } from './loan-document-routing.module';
import { LoanDocumentSelectModalComponent } from './loan-document-select-modal/loan-document-select-modal.component';
import { LoanDocumentComponent } from './loan-document/loan-document.component';

@NgModule({
  declarations: [LoanDocumentComponent, LoanDocumentSelectModalComponent],
  imports: [
    CommonModule,
    LoanDocumentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class LoanDocumentModule {}
