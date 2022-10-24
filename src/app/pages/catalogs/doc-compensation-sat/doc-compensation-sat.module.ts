import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocCompensationSatFormComponent } from './doc-compensation-sat-form/doc-compensation-sat-form.component';
import { DocCompensationSatListComponent } from './doc-compensation-sat-list/doc-compensation-sat-list.component';
import { DocCompensationSatRoutingModule } from './doc-compensation-sat-routing.module';

@NgModule({
  declarations: [
    DocCompensationSatFormComponent,
    DocCompensationSatListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    DocCompensationSatRoutingModule,
  ],
})
export class DocCompensationSatModule {}
