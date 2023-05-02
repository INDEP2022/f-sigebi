import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentRefundMainComponent } from './payment-refund-main/payment-refund-main.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentRefundMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRefundRoutingModule {}
