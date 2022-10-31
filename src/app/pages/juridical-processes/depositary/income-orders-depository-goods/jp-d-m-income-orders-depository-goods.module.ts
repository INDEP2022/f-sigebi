import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { JpDIodgCIncomeOrdersDepositoryGoodsComponent } from './jp-d-iodg-c-income-orders-depository-goods/jp-d-iodg-c-income-orders-depository-goods.component';
import { JpDMIncomeOrdersDepositoryGoodsRoutingModule } from './jp-d-m-income-orders-depository-goods-routing.module';

@NgModule({
  declarations: [JpDIodgCIncomeOrdersDepositoryGoodsComponent],
  imports: [
    CommonModule,
    JpDMIncomeOrdersDepositoryGoodsRoutingModule,
    SharedModule,
  ],
})
export class JpDMIncomeOrdersDepositoryGoodsModule {}
