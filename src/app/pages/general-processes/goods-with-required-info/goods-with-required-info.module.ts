import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsWithRequiredInfoRoutingModule } from './goods-with-required-info-routing.module';
import { GoodsWithRequiredInfoComponent } from './goods-with-required-info/goods-with-required-info.component';

@NgModule({
  declarations: [GoodsWithRequiredInfoComponent],
  imports: [CommonModule, GoodsWithRequiredInfoRoutingModule, SharedModule],
})
export class GoodsWithRequiredInfoModule {}
