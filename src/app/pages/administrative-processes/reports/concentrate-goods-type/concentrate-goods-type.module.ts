import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConcentrateGoodsTypeRoutingModule } from './concentrate-goods-type-routing.module';
import { ConcentrateGoodsTypeComponent } from './concentrate-goods-type/concentrate-goods-type.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ConcentrateGoodsTypeComponent
  ],
  imports: [
    CommonModule,
    ConcentrateGoodsTypeRoutingModule,
    SharedModule,
  ]
})
export class ConcentrateGoodsTypeModule { }
