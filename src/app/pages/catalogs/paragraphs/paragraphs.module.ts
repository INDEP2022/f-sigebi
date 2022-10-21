import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ParagraphsFormComponent } from './paragraphs-form/paragraphs-form.component';
import { ParagraphsListComponent } from './paragraphs-list/paragraphs-list.component';
import { ParagraphsRoutingModule } from './paragraphs-routing.module';

@NgModule({
  declarations: [ParagraphsFormComponent, ParagraphsListComponent],
  imports: [
    CommonModule,
    ParagraphsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ParagraphsModule {}
