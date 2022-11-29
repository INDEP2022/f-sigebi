import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CRrpCPaymentReceiptsReportComponent } from './c-rrp-c-payment-receipts-report/c-rrp-c-payment-receipts-report.component';
import { CRrpMPaymentReceiptsReportRoutingModule } from './c-rrp-m-payment-receipts-report-routing.module';

@NgModule({
  declarations: [CRrpCPaymentReceiptsReportComponent],
  imports: [
    CommonModule,
    CRrpMPaymentReceiptsReportRoutingModule,
    SharedModule,
  ],
})
export class CRrpMPaymentReceiptsReportModule {}
