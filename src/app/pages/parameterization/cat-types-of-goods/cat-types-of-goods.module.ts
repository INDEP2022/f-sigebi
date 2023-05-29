import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatTypesOfGoodsRoutingModule } from './cat-types-of-goods-routing.module';

import { CatTypesOfGoodsComponent } from './cat-types-of-goods/cat-types-of-goods.component';
import { CatTypesOfGoodsTypesFormComponent } from './cat-types-of-goods-types-form/cat-types-of-goods-types-form.component';
import { CatTypesOfGoodsSubTypeComponent } from './cat-types-of-goods-sub-type/cat-types-of-goods-sub-type.component';

@NgModule({
  declarations: [CatTypesOfGoodsComponent, CatTypesOfGoodsTypesFormComponent, CatTypesOfGoodsSubTypeComponent],
  imports: [CommonModule, CatTypesOfGoodsRoutingModule, SharedModule],
})
export class CatTypesOfGoodsModule {}
