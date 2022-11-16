import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpGoodsPartializationRoutingModule } from './gp-goods-partialization-routing.module';
import { GpGoodsPartializationComponent } from './gp-goods-partialization/gp-goods-partialization.component';

@NgModule({
  declarations: [GpGoodsPartializationComponent],
  imports: [CommonModule, GpGoodsPartializationRoutingModule, SharedModule],
})
export class GpGoodsPartializationModule {}
