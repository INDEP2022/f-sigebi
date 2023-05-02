import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ConsultGoodsRoutingModule } from './consult-goods-routing.module';
import { ConsultGoodsComponent } from './consult-goods/consult-goods.component';

@NgModule({
  declarations: [ConsultGoodsComponent],
  imports: [CommonModule, ConsultGoodsRoutingModule, SharedModule],
})
export class ConsultGoodsModule {}
