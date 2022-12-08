import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { DateDocumentsRoutingModule } from './date-documents-routing.module';
import { DateDocumentsComponent } from './date-documents/date-documents.component';

@NgModule({
  declarations: [DateDocumentsComponent],
  imports: [CommonModule, DateDocumentsRoutingModule, SharedModule],
})
export class DateDocumentsModule {}
