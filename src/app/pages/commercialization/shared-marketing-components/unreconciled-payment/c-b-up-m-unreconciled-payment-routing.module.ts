import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CBUpCUnreconciledPaymentComponent } from './unreconciled-payment/c-b-up-c-unreconciled-payment.component';

const routes: Routes = [
  {
    path: '',
    component: CBUpCUnreconciledPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBUpMUnreconciledPaymentRoutingModule {}
