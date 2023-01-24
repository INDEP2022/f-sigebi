import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocCompensationFormComponent } from './doc-compensation-form/doc-compensation-form.component';
import { DocCompensationListComponent } from './doc-compensation-list/doc-compensation-list.component';
import { DocCompensationRoutingModule } from './doc-compensation-routing.module';

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
