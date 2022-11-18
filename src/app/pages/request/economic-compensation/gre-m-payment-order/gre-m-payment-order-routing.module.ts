import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GreCPaymentOrderMainComponent } from './gre-c-payment-order-main/gre-c-payment-order-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: GreCPaymentOrderMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreMPaymentOrderRoutingModule {}
