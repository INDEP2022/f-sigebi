import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentEntryRoutingModule } from './document-entry-routing.module';
import { DocumentEntryComponent } from './document-entry/document-entry.component';

@NgModule({
  declarations: [DocumentEntryComponent],
  imports: [
    CommonModule,
    DocumentEntryRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class DocumentEntryModule {}
