import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentServicesGoodComponent } from './payment-services-good.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentServicesGoodComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentServicesGoodRoutingModule {}
