import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocCompensationRoutingModule } from './doc-compensation-routing.module';
import { DocCompensationListComponent } from './doc-compensation-list/doc-compensation-list.component';
import { DocCompensationFormComponent } from './doc-compensation-form/doc-compensation-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DocCompensationService } from 'src/app/core/services/catalogs/doc-compensation.service';

@NgModule({
  declarations: [DocCompensationListComponent, DocCompensationFormComponent],
  imports: [
    CommonModule,
    DocCompensationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  providers: [DocCompensationService],
})
export class DocCompensationModule {}
