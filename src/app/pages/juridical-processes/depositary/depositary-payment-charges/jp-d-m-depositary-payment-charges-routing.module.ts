import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDDpcCDepositaryPaymentChargesComponent } from './jp-d-dpc-c-depositary-payment-charges/jp-d-dpc-c-depositary-payment-charges.component';

const routes: Routes = [
  {
    path: '',
    component: JpDDpcCDepositaryPaymentChargesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMDepositaryPaymentChargesRoutingModule {}
