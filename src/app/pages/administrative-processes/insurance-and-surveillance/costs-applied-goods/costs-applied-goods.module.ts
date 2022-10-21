import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { CostsAppliedGoodsRoutingModule } from './costs-applied-goods-routing.module';
import { CostsAppliedGoodsComponent } from './costs-applied-goods/costs-applied-goods.component';

@NgModule({
  declarations: [CostsAppliedGoodsComponent],
  imports: [
    CommonModule,
    CostsAppliedGoodsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class CostsAppliedGoodsModule {}
