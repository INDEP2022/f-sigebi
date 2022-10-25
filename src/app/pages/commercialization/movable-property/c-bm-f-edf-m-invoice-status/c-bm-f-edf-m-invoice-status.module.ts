import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CBmFEdfCInvoiceStatusModalComponent } from './c-bm-f-edf-c-invoice-status-modal/c-bm-f-edf-c-invoice-status-modal.component';
import { CBmFEdfCInvoiceStatusComponent } from './c-bm-f-edf-c-invoice-status/c-bm-f-edf-c-invoice-status.component';
import { CBmFEdfMInvoiceStatusRoutingModule } from './c-bm-f-edf-m-invoice-status-routing.module';

@NgModule({
  declarations: [
    CBmFEdfCInvoiceStatusComponent,
    CBmFEdfCInvoiceStatusModalComponent,
  ],
  imports: [
    CommonModule,
    CBmFEdfMInvoiceStatusRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CBmFEdfMInvoiceStatusModule {}
