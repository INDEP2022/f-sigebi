import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsPartializationRoutingModule } from './goods-partialization-routing.module';
import { GoodsPartializationComponent } from './goods-partialization/goods-partialization.component';

@NgModule({
  declarations: [GoodsPartializationComponent],
  imports: [CommonModule, GoodsPartializationRoutingModule, SharedModule],
})
export class GoodsPartializationModule {}
