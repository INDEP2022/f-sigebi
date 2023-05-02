import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { SatSaeGoodsLoadRoutingModule } from './sat-sae-goods-load-routing.module';
import { SatSaeGoodsLoadComponent } from './sat-sae-goods-load/sat-sae-goods-load.component';

@NgModule({
  declarations: [SatSaeGoodsLoadComponent],
  imports: [CommonModule, SatSaeGoodsLoadRoutingModule, SharedModule],
})
export class SatSaeGoodsLoadModule {}
