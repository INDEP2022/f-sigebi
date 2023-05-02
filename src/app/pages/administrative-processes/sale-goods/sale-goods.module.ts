import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SaleGoodsGamesParticipantsPaymentsModule } from './sale-goods-games-participants-payments/sale-goods-games-participants-payments.module';
import { SaleGoodsRoutingModule } from './sale-goods-routing.module';
import { SaleGoodsComponent } from './sale-goods/sale-goods.component';

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
