import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispersionPaymentComponent } from './dispersion-payment/dispersion-payment.component';

const routes: Routes = [
  {
    path: '',
    component: DispersionPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentDispersionMonitorRoutingModule {}
