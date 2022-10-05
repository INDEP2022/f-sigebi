import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocCompensationRoutingModule } from './doc-compensation-routing.module';
import { DocCompensationListComponent } from './doc-compensation-list/doc-compensation-list.component';
import { DocCompensationFormComponent } from './doc-compensation-form/doc-compensation-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [DocCompensationListComponent, DocCompensationFormComponent],
  imports: [
    CommonModule,
    DocCompensationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class DocCompensationModule {}
