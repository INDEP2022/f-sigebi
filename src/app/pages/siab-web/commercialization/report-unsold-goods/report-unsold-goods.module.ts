import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReportUnsoldGoodsRoutingModule } from './report-unsold-goods-routing.module';
import { ReportUnsoldGoodsComponent } from './report-unsold-goods/report-unsold-goods.component';

@NgModule({
  declarations: [ReportUnsoldGoodsComponent],
  imports: [CommonModule, ReportUnsoldGoodsRoutingModule, SharedModule],
})
export class ReportUnsoldGoodsModule {}
