import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { SiseProcessFormComponent } from './sise-process-form/sise-process-form.component';
import { SiseProcessListComponent } from './sise-process-list/sise-process-list.component';
import { SiseProcessRoutingModule } from './sise-process-routing.module';

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
