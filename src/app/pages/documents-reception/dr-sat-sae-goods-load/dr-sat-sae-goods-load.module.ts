import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrSatSaeGoodsLoadRoutingModule } from './dr-sat-sae-goods-load-routing.module';
import { DrSatSaeGoodsLoadComponent } from './dr-sat-sae-goods-load/dr-sat-sae-goods-load.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DrSatSaeGoodsLoadComponent],
  imports: [CommonModule, DrSatSaeGoodsLoadRoutingModule, SharedModule],
})
export class DrSatSaeGoodsLoadModule {}
