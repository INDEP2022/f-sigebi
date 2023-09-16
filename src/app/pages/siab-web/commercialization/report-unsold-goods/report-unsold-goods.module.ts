import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReportUnsoldGoodsRoutingModule } from './report-unsold-goods-routing.module';
import { DetailEventsComponent } from './report-unsold-goods/component-render/detail-events/detail-events.component';
import { DetailStatusComponent } from './report-unsold-goods/component-render/detail-status/detail-status.component';
import { ReportUnsoldGoodsComponent } from './report-unsold-goods/report-unsold-goods.component';

@NgModule({
  declarations: [
    ReportUnsoldGoodsComponent,
    DetailStatusComponent,
    DetailEventsComponent,
  ],
  imports: [CommonModule, ReportUnsoldGoodsRoutingModule, SharedModule],
})
export class ReportUnsoldGoodsModule {}
