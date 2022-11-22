import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRrpCPaymentReceiptsReportComponent } from './c-rrp-c-payment-receipts-report/c-rrp-c-payment-receipts-report.component';

const routes: Routes = [
  {
    path: '',
    component: CRrpCPaymentReceiptsReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CRrpMPaymentReceiptsReportRoutingModule {}
