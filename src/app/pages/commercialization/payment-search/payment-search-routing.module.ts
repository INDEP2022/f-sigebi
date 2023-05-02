import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentSearchListComponent } from './payment-search-list/payment-search-list.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentSearchListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentSearchRoutingModule {}
