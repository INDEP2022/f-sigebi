import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatDepositoryPaymentComponent } from './cat-depository-payment/cat-depository-payment.component';

const routes: Routes = [
  {
    path: '',
    component: CatDepositoryPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatDepositoryPaymentRoutingModule {}
//REPETIDO, ELIMINAR
