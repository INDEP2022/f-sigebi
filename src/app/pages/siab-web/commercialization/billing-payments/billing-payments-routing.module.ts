import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { billingPaymentsComponent } from './billing-payments/billing-payments.component';

const routes: Routes = [
  {
    path: '',
    component: billingPaymentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class billingPaymentsRoutingModule {}
