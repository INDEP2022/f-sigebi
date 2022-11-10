import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPCQuestionCatalogModalComponent } from './c-p-c-question-catalog-modal/c-p-c-question-catalog-modal.component';
import { CPCQuestionCatalogComponent } from './c-p-c-question-catalog/c-p-c-question-catalog.component';
import { CPMQuestionCatalogRoutingModule } from './c-p-m-question-catalog-routing.module';

@NgModule({
  declarations: [CPCQuestionCatalogComponent, CPCQuestionCatalogModalComponent],
  imports: [
    CommonModule,
    CPMQuestionCatalogRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMQuestionCatalogModule {}
