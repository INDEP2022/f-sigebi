import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SwComerCReportInvoicesComponent } from './sw-comer-c-report-invoices/sw-comer-c-report-invoices.component';
import { SwComerMReportInvoicesRoutingModule } from './sw-comer-m-report-invoices-routing.module';

@NgModule({
  declarations: [SwComerCReportInvoicesComponent],
  imports: [CommonModule, SwComerMReportInvoicesRoutingModule],
})
export class SwComerMReportInvoicesModule {}
