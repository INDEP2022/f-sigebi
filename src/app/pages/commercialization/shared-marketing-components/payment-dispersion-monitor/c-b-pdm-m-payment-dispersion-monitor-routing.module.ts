import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBDpCDispersionPaymentComponent } from './dispersion-payment/c-b-dp-c-dispersion-payment.component';

const routes: Routes = [
  {
    path: '',
    component: CBDpCDispersionPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBPdmMPaymentDispersionMonitorRoutingModule {}
