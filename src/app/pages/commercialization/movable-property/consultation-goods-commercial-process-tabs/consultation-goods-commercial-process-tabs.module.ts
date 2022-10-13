import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { CBmCdbMConsultationGoodsCommercialModule } from '../c-bm-cdb-m-consultation-goods-commercial/c-bm-cdb-m-consultation-goods-commercial.module';

import { ConsultationGoodsCommercialProcessTabsRoutingModule } from './consultation-goods-commercial-process-tabs-routing.module';
import { ConsultationGoodsCommercialProcessTabsComponent } from './consultation-goods-commercial-process-tabs/consultation-goods-commercial-process-tabs.component';


@NgModule({
  declarations: [
    ConsultationGoodsCommercialProcessTabsComponent
  ],
  imports: [
    CommonModule,
    ConsultationGoodsCommercialProcessTabsRoutingModule,
    SharedModule,
    TabsModule,
    CBmCdbMConsultationGoodsCommercialModule
  ]
})
export class ConsultationGoodsCommercialProcessTabsModule { }
