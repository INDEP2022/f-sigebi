import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { PaymentReceiptsReportRoutingModule } from './payment-receipts-report-routing.module';
import { PaymentReceiptsReportComponent } from './payment-receipts-report/payment-receipts-report.component';

@NgModule({
  declarations: [PaymentReceiptsReportComponent],
  imports: [CommonModule, PaymentReceiptsReportRoutingModule, SharedModule],
})
export class PaymentReceiptsReportModule {}
