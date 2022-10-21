import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostsAppliedGoodsRoutingModule } from './costs-applied-goods-routing.module';
import { CostsAppliedGoodsComponent } from './costs-applied-goods/costs-applied-goods.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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
