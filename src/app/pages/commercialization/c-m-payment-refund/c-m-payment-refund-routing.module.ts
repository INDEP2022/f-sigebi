import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMPaymentRefundMainComponent } from './c-m-payment-refund-main/c-m-payment-refund-main.component';

const routes: Routes = [
  {
    path: '',
    component: CMPaymentRefundMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CMPaymentRefundRoutingModule {}
