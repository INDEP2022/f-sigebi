import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { TransferorsDetailComponent } from './transferors-detail/transferors-detail.component';
import { TransferorsListComponent } from './transferors-list/transferors-list.component';
import { TransferorsRoutingModule } from './transferors-routing.module';

@NgModule({
  declarations: [TransferorsListComponent, TransferorsDetailComponent],
  imports: [
    CommonModule,
    TransferorsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class TransferorsModule {}
