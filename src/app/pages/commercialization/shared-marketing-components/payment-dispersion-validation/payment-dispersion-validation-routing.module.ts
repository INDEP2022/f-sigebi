import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentDispersionValidationComponent } from './payment-dispersion-validation/payment-dispersion-validation.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentDispersionValidationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentDispersionValidationRoutingModule {}
