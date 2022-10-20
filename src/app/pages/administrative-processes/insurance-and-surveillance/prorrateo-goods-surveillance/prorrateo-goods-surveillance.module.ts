import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProrrateoGoodsSurveillanceRoutingModule } from './prorrateo-goods-surveillance-routing.module';
import { ProrrateoGoodsSurveillanceComponent } from './prorrateo-goods-surveillance/prorrateo-goods-surveillance.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProrrateoConceptsComponent } from './prorrateo-concepts/prorrateo-concepts.component';
import { ProrrateoGoodsComponent } from './prorrateo-goods/prorrateo-goods.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  declarations: [
    ProrrateoGoodsSurveillanceComponent,
    ProrrateoConceptsComponent,
    ProrrateoGoodsComponent,
  ],
  imports: [
    CommonModule,
    ProrrateoGoodsSurveillanceRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TabsModule,
  ],
})
export class ProrrateoGoodsSurveillanceModule {}
