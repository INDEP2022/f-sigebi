import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCCatDepositoryPaymentComponent } from './c-p-c-cat-depository-payment/c-p-c-cat-depository-payment.component';

const routes: Routes = [
  {
    path: '',
    component: CPCCatDepositoryPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCatDepositoryPaymentRoutingModule {}
