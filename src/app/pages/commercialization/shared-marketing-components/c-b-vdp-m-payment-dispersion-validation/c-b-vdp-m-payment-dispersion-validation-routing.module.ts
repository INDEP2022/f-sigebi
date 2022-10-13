import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBVdpCPaymentDispersionValidationComponent } from './c-b-vdp-c-payment-dispersion-validation/c-b-vdp-c-payment-dispersion-validation.component';

const routes: Routes = [
  {
    path: '',
    component: CBVdpCPaymentDispersionValidationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBVdpMPaymentDispersionValidationRoutingModule {}
