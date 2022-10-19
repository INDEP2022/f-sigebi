import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiseProcessRoutingModule } from './sise-process-routing.module';
import { SiseProcessFormComponent } from './sise-process-form/sise-process-form.component';
import { SiseProcessListComponent } from './sise-process-list/sise-process-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [SiseProcessFormComponent, SiseProcessListComponent],
  imports: [
    CommonModule,
    SiseProcessRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class SiseProcessModule {}
