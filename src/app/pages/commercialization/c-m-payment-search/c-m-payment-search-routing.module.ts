import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMPaymentSearchListComponent } from './c-m-payment-search-list/c-m-payment-search-list.component';

const routes: Routes = [
  {
    path: '',
    component: CMPaymentSearchListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CMPaymentSearchRoutingModule {}
