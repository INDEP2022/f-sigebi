import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClasifyProgrammedGoodsRoutingModule } from './clasify-programmed-goods-routing.module';
import { ClasifyProgrammedGoodsComponent } from './clasify-programmed-goods/clasify-programmed-goods.component';

@NgModule({
  declarations: [ClasifyProgrammedGoodsComponent],
  imports: [CommonModule, ClasifyProgrammedGoodsRoutingModule],
})
export class ClasifyProgrammedGoodsModule {}
