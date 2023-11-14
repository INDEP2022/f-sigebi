import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentOfGoodsRoutingModule } from './payment-of-goods-routing.module';
import { PaymentOfGoodsComponent } from './payment-of-goods/payment-of-goods.component';

@NgModule({
  declarations: [PaymentOfGoodsComponent],
  imports: [
    CommonModule,
    PaymentOfGoodsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class PaymentOfGoodsModule {}
