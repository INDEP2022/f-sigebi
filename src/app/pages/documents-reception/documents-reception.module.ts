import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DocumentsReceptionRoutingModule } from './documents-reception-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DocumentsReceptionRoutingModule,
    ModalModule.forChild(),
  ],
})
export class DocumentsReceptionModule {}
