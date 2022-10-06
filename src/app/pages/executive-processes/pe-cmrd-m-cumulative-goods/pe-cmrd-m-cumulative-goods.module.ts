import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { PeCmrdMCumulativeGoodsRoutingModule } from './pe-cmrd-m-cumulative-goods-routing.module';
import { PeCmrdCCumulativeGoodsComponent } from './pe-cmrd-c-cumulative-goods/pe-cmrd-c-cumulative-goods.component';


@NgModule({
  declarations: [
    PeCmrdCCumulativeGoodsComponent,
  ],
  imports: [
    CommonModule,
    PeCmrdMCumulativeGoodsRoutingModule,
    SharedModule
  ]
})
export class PeCmrdMCumulativeGoodsModule { }
