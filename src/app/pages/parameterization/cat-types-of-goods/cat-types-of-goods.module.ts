import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatTypesOfGoodsRoutingModule } from './cat-types-of-goods-routing.module';

import { CatTypesOfGoodsComponent } from './cat-types-of-goods/cat-types-of-goods.component';

@NgModule({
  declarations: [CatTypesOfGoodsComponent],
  imports: [CommonModule, CatTypesOfGoodsRoutingModule, SharedModule],
})
export class CatTypesOfGoodsModule {}
