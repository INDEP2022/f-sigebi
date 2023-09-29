import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { DocumentsSentToMasterfileRoutingModule } from './documents-sent-to-masterfile-routing.module';
import { DocumentsSentToMasterfileComponent } from './documents-sent-to-masterfile/documents-sent-to-masterfile.component';
import { ComponentRenderDocumentSentComponent } from './documents-sent-to-masterfile/render-component/component-render-document-sent/component-render-document-sent.component';

@NgModule({
  declarations: [
    DocumentsSentToMasterfileComponent,
    ComponentRenderDocumentSentComponent,
  ],
  imports: [
    CommonModule,
    DocumentsSentToMasterfileRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class DocumentsSentToMasterfileModule {}
