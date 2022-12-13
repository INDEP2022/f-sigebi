import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { IncomeOrdersDepositoryGoodsRoutingModule } from './income-orders-depository-goods-routing.module';
import { IncomeOrdersDepositoryGoodsComponent } from './income-orders-depository-goods/income-orders-depository-goods.component';

@NgModule({
  declarations: [IncomeOrdersDepositoryGoodsComponent],
  imports: [
    CommonModule,
    IncomeOrdersDepositoryGoodsRoutingModule,
    SharedModule,
  ],
})
export class IncomeOrdersDepositoryGoodsModule {}
