import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentValidationsComponent } from './payment-validations/payment-validations.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentValidationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositPaymentValidationsRoutingModule {}
