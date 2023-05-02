import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { QuestionCatalogModalComponent } from './question-catalog-modal/question-catalog-modal.component';
import { QuestionCatalogRoutingModule } from './question-catalog-routing.module';
import { QuestionCatalogComponent } from './question-catalog/question-catalog.component';
import { ResponseCatalogModalComponent } from './response-catalog-modal/response-catalog-modal.component';

@NgModule({
  declarations: [
    QuestionCatalogComponent,
    QuestionCatalogModalComponent,
    ResponseCatalogModalComponent,
  ],
  imports: [
    CommonModule,
    QuestionCatalogRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class QuestionCatalogModule {}
