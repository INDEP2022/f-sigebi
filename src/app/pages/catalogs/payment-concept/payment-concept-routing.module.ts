import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentConceptListComponent } from './payment-concept-list/payment-concept-list.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentConceptListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentConceptRoutingModule {}
