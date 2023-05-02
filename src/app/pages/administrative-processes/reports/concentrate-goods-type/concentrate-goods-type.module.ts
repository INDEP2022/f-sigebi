import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ConcentrateGoodsTypeRoutingModule } from './concentrate-goods-type-routing.module';
import { ConcentrateGoodsTypeComponent } from './concentrate-goods-type/concentrate-goods-type.component';

@NgModule({
  declarations: [ConcentrateGoodsTypeComponent],
  imports: [CommonModule, ConcentrateGoodsTypeRoutingModule, SharedModule],
})
export class ConcentrateGoodsTypeModule {}
