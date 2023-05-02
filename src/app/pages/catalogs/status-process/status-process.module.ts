import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatusProcessFormComponent } from './status-process-form/status-process-form.component';
import { StatusProcessListComponent } from './status-process-list/status-process-list.component';
import { StatusProcessRoutingModule } from './status-process-routing.module';

@NgModule({
  declarations: [StatusProcessListComponent, StatusProcessFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    StatusProcessRoutingModule,
  ],
})
export class StatusProcessModule {}
