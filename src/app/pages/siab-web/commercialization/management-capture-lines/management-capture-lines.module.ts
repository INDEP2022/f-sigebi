import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { managementCaptureLinesModalComponent } from './management-capture-lines-modal/management-capture-lines-modal.component';
import { managementCaptureLinesRoutingModule } from './management-capture-lines-routing.module';
import { managementCaptureLinesComponent } from './management-capture-lines/management-capture-lines.component';

@NgModule({
  declarations: [
    managementCaptureLinesComponent,
    managementCaptureLinesModalComponent,
  ],
  imports: [
    CommonModule,
    managementCaptureLinesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class managementCaptureLinesModule {}
