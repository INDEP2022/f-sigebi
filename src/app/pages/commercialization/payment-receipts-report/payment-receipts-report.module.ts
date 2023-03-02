import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { DepartmentsSharedComponent } from 'src/app/@standalone/shared-forms/departments-shared/departments-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentReceiptsReportRoutingModule } from './payment-receipts-report-routing.module';
import { PaymentReceiptsReportComponent } from './payment-receipts-report/payment-receipts-report.component';

@NgModule({
  declarations: [PaymentReceiptsReportComponent],
  imports: [
    CommonModule,
    PaymentReceiptsReportRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    DepartmentsSharedComponent,
  ],
})
export class PaymentReceiptsReportModule {}
