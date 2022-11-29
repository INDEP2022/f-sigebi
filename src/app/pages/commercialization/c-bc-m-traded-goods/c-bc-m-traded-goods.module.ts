import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { CBcCTradedGoodsComponent } from './c-bc-c-traded-goods/c-bc-c-traded-goods.component';
import { CBcMTradedGoodsRoutingModule } from './c-bc-m-traded-goods-routing.module';

@NgModule({
  declarations: [CBcCTradedGoodsComponent],
  imports: [
    CommonModule,
    CBcMTradedGoodsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CBcMTradedGoodsModule {}
