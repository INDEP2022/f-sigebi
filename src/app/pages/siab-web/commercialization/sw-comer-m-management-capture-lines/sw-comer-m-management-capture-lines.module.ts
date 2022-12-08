import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { SwComerCManagementCaptureLinesModalComponent } from './sw-comer-c-management-capture-lines-modal/sw-comer-c-management-capture-lines-modal.component';
import { SwComerCManagementCaptureLinesComponent } from './sw-comer-c-management-capture-lines/sw-comer-c-management-capture-lines.component';
import { SwComerMManagementCaptureLinesRoutingModule } from './sw-comer-m-management-capture-lines-routing.module';

@NgModule({
  declarations: [
    SwComerCManagementCaptureLinesComponent,
    SwComerCManagementCaptureLinesModalComponent,
  ],
  imports: [
    CommonModule,
    SwComerMManagementCaptureLinesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class SwComerMManagementCaptureLinesModule {}
