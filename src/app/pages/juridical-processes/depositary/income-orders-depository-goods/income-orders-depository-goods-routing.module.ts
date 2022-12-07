import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeOrdersDepositoryGoodsComponent } from './income-orders-depository-goods/income-orders-depository-goods.component';

const routes: Routes = [
  {
    path: '',
    component: IncomeOrdersDepositoryGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomeOrdersDepositoryGoodsRoutingModule {}
