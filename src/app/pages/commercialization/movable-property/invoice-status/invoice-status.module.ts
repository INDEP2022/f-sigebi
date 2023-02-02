import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { InvoiceStatusModalComponent } from './invoice-status-modal/invoice-status-modal.component';
import { InvoiceStatusRoutingModule } from './invoice-status-routing.module';
import { InvoiceStatusComponent } from './invoice-status/invoice-status.component';

@NgModule({
  declarations: [InvoiceStatusComponent, InvoiceStatusModalComponent],
  imports: [
    CommonModule,
    InvoiceStatusRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class InvoiceStatusModule {}
