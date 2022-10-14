import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusProcessRoutingModule } from './status-process-routing.module';
import { StatusProcessListComponent } from './status-process-list/status-process-list.component';
import { StatusProcessFormComponent } from './status-process-form/status-process-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
