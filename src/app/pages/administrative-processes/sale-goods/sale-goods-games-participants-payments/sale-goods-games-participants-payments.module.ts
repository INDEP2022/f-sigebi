import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleGoodsGamesParticipantsPaymentsRoutingModule } from './sale-goods-games-participants-payments-routing.module';
import { SaleGoodsGamesComponent } from './sale-goods-games/sale-goods-games.component';
import { SaleGoodsParticipantsComponent } from './sale-goods-participants/sale-goods-participants.component';
import { SaleGoodsPaymentsComponent } from './sale-goods-payments/sale-goods-payments.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';
import { SaleGoodsGamesIncorporatePackagesComponent } from './sale-goods-games-incorporate-packages/sale-goods-games-incorporate-packages.component';
import { SaleGoodsGamesEstateComponent } from './sale-goods-games-estate/sale-goods-games-estate.component';


@NgModule({
  declarations: [
    SaleGoodsGamesComponent,
    SaleGoodsParticipantsComponent,
    SaleGoodsPaymentsComponent,
    SaleGoodsGamesIncorporatePackagesComponent,
    SaleGoodsGamesEstateComponent
  ],
  exports: [
    SaleGoodsGamesComponent,
    SaleGoodsParticipantsComponent,
    SaleGoodsPaymentsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SaleGoodsGamesParticipantsPaymentsRoutingModule,
    Ng2SmartTableModule,
  ]
})
export class SaleGoodsGamesParticipantsPaymentsModule { }
