import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpGoodsWithRequiredInfoRoutingModule } from './gp-goods-with-required-info-routing.module';
import { GpGoodsWithRequiredInfoComponent } from './gp-goods-with-required-info/gp-goods-with-required-info.component';

@NgModule({
  declarations: [GpGoodsWithRequiredInfoComponent],
  imports: [CommonModule, GpGoodsWithRequiredInfoRoutingModule, SharedModule],
})
export class GpGoodsWithRequiredInfoModule {}
