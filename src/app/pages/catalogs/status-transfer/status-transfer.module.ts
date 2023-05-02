import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatusTransferFormComponent } from './status-transfer-form/status-transfer-form.component';
import { StatusTransferListComponent } from './status-transfer-list/status-transfer-list.component';
import { StatusTransferRoutingModule } from './status-transfer-routing.module';

@NgModule({
  declarations: [StatusTransferListComponent, StatusTransferFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    StatusTransferRoutingModule,
  ],
})
export class StatusTransferModule {}
