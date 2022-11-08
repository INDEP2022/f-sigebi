import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { DeregistrationOfGoodsRoutingModule } from './deregistration-of-goods-routing.module';
import { DeregistrationOfGoodsComponent } from './deregistration-of-goods/deregistration-of-goods.component';

@NgModule({
  declarations: [DeregistrationOfGoodsComponent],
  imports: [
    CommonModule,
    DeregistrationOfGoodsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class DeregistrationOfGoodsModule {}
