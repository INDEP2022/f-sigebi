import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';

import { ConsultationGoodsCommercialModule } from '../consultation-goods-commercial/consultation-goods-commercial.module';

import { ConsultationGoodsCommercialProcessTabsRoutingModule } from './consultation-goods-commercial-process-tabs-routing.module';
import { ConsultationGoodsCommercialProcessTabsComponent } from './consultation-goods-commercial-process-tabs/consultation-goods-commercial-process-tabs.component';

@NgModule({
  declarations: [ConsultationGoodsCommercialProcessTabsComponent],
  imports: [
    CommonModule,
    ConsultationGoodsCommercialProcessTabsRoutingModule,
    SharedModule,
    TabsModule,
    ConsultationGoodsCommercialModule,
  ],
})
export class ConsultationGoodsCommercialProcessTabsModule {}
