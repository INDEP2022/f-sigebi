import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { PaPrCPaymentRequestComponent } from './payment-request/pa-pr-c-payment-request.component';

const routes: Routes = [
  {
    path: 'payment-request',
    component: PaPrCPaymentRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaRMRefundsRoutingModule { }
