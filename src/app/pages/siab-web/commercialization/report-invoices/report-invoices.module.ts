import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { reportInvoicesRoutingModule } from './report-invoices-routing.module';
import { reportInvoicesComponent } from './report-invoices/report-invoices.component';

@NgModule({
  declarations: [reportInvoicesComponent],
  imports: [CommonModule, reportInvoicesRoutingModule, SharedModule],
})
export class reportInvoicesModule {}
