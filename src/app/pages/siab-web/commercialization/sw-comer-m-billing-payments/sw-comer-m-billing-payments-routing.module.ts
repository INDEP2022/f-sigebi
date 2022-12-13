import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwComerCBillingPaymentsComponent } from './sw-comer-c-billing-payments/sw-comer-c-billing-payments.component';

const routes: Routes = [
  {
    path: '',
    component: SwComerCBillingPaymentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwComerMBillingPaymentsRoutingModule {}
