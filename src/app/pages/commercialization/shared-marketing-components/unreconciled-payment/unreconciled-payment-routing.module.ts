import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { UnreconciledPaymentComponent } from './unreconciled-payment/unreconciled-payment.component';

const routes: Routes = [
  {
    path: '',
    component: UnreconciledPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnreconciledPaymentRoutingModule {}
