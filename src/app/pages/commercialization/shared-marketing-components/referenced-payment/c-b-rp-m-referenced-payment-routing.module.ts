import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBRpCReferencedPaymentComponent } from './referenced-payment/c-b-rp-c-referenced-payment.component';

const routes: Routes = [
  {
    path: '',
    component: CBRpCReferencedPaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBRpMReferencedPaymentRoutingModule { }
