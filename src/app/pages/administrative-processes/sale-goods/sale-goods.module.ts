import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleGoodsRoutingModule } from './sale-goods-routing.module';
import { SaleGoodsComponent } from './sale-goods/sale-goods.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SaleGoodsGamesParticipantsPaymentsModule } from './sale-goods-games-participants-payments/sale-goods-games-participants-payments.module';

@NgModule({
  declarations: [SaleGoodsComponent],
  imports: [
    CommonModule,
    SaleGoodsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    Ng2SmartTableModule,
    TabsModule,
    SaleGoodsGamesParticipantsPaymentsModule,
  ],
})
export class SaleGoodsModule {}
