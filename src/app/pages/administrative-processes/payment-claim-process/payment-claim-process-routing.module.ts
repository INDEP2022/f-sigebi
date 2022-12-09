import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentClaimProcessComponent } from './payment-claim-process/payment-claim-process.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentClaimProcessComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentClaimProcessRoutingModule {}
