import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusTransferRoutingModule } from './status-transfer-routing.module';
import { StatusTransferListComponent } from './status-transfer-list/status-transfer-list.component';
import { StatusTransferFormComponent } from './status-transfer-form/status-transfer-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    StatusTransferListComponent,
    StatusTransferFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    StatusTransferRoutingModule
  ]
})
export class StatusTransferModule { }
