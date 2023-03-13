import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferencedPaymentComponent } from './referenced-payment/referenced-payment.component';

const routes: Routes = [
  {
    path: '',
    component: ReferencedPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferencedPaymentRoutingModule {}
