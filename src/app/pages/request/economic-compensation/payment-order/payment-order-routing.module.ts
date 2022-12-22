import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentOrderMainComponent } from './payment-order-main/payment-order-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: PaymentOrderMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentOrderRoutingModule {}
