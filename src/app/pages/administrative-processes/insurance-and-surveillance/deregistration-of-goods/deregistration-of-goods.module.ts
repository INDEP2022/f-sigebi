import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeregistrationOfGoodsRoutingModule } from './deregistration-of-goods-routing.module';
import { DeregistrationOfGoodsComponent } from './deregistration-of-goods/deregistration-of-goods.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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
