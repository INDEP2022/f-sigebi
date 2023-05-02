import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { DocumentsSentToMasterfileRoutingModule } from './documents-sent-to-masterfile-routing.module';
import { DocumentsSentToMasterfileComponent } from './documents-sent-to-masterfile/documents-sent-to-masterfile.component';

@NgModule({
  declarations: [DocumentsSentToMasterfileComponent],
  imports: [
    CommonModule,
    DocumentsSentToMasterfileRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class DocumentsSentToMasterfileModule {}
