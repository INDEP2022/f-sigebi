import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '../../../../shared/shared.module';
import { ProrrateoConceptsComponent } from './prorrateo-concepts/prorrateo-concepts.component';
import { ProrrateoGoodsSurveillanceRoutingModule } from './prorrateo-goods-surveillance-routing.module';
import { ProrrateoGoodsSurveillanceComponent } from './prorrateo-goods-surveillance/prorrateo-goods-surveillance.component';
import { ProrrateoGoodsComponent } from './prorrateo-goods/prorrateo-goods.component';

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
