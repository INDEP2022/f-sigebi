import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatOfSeparatorsDocumentsModalComponent } from './cat-of-separators-documents-modal/cat-of-separators-documents-modal.component';
import { CatOfSeparatorsDocumentsRoutingModule } from './cat-of-separators-documents-routing.module';
import { CatOfSeparatorsDocumentsComponent } from './cat-of-separators-documents/cat-of-separators-documents.component';

@NgModule({
  declarations: [
    CatOfSeparatorsDocumentsComponent,
    CatOfSeparatorsDocumentsModalComponent,
  ],
  imports: [
    CommonModule,
    CatOfSeparatorsDocumentsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CatOfSeparatorsDocumentsModule {}
