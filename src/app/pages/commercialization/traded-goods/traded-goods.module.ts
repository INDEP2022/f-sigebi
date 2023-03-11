import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { TradedGoodsRoutingModule } from './traded-goods-routing.module';
import { TradedGoodsComponent } from './traded-goods/traded-goods.component';

@NgModule({
  declarations: [TradedGoodsComponent],
  imports: [
    CommonModule,
    TradedGoodsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    DelegationSharedComponent,
  ],
})
export class CBcMTradedGoodsModule {}
