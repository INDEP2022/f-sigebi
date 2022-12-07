import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositaryPaymentChargesComponent } from './depositary-payment-charges/depositary-payment-charges.component';

const routes: Routes = [
  {
    path: '',
    component: DepositaryPaymentChargesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositaryPaymentChargesRoutingModule {}
