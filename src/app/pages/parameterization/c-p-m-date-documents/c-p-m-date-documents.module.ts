import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPMDateDocumentsRoutingModule } from './c-p-m-date-documents-routing.module';
import { CPMDateDocumentsComponent } from './c-p-m-date-documents/c-p-m-date-documents.component';

@NgModule({
  declarations: [CPMDateDocumentsComponent],
  imports: [CommonModule, CPMDateDocumentsRoutingModule, SharedModule],
})
export class CPMDateDocumentsModule {}
