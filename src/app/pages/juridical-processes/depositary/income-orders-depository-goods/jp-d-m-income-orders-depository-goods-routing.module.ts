import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDIodgCIncomeOrdersDepositoryGoodsComponent } from './jp-d-iodg-c-income-orders-depository-goods/jp-d-iodg-c-income-orders-depository-goods.component';

const routes: Routes = [
  {
    path: '',
    component: JpDIodgCIncomeOrdersDepositoryGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMIncomeOrdersDepositoryGoodsRoutingModule {}
