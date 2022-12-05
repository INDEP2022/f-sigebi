import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentReceiptsReportComponent } from './payment-receipts-report/payment-receipts-report.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentReceiptsReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentReceiptsReportRoutingModule {}
