import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from 'src/app/shared/shared.module';
import { DateDocumentsDictumComponent } from './date-documents-dictum/date-documents-dictum.component';
import { DateDocumentsModalComponent } from './date-documents-modal/date-documents-modal.component';
import { DateDocumentsRoutingModule } from './date-documents-routing.module';
import { DateDocumentsComponent } from './date-documents/date-documents.component';

@NgModule({
  declarations: [
    DateDocumentsComponent,
    DateDocumentsModalComponent,
    DateDocumentsDictumComponent,
  ],
  imports: [
    CommonModule,
    DateDocumentsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class DateDocumentsModule {}
