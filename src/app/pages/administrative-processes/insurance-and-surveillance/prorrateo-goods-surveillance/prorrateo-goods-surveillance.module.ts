import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProrrateoConceptsComponent } from './prorrateo-concepts/prorrateo-concepts.component';
import { ProrrateoGoodsSurveillanceRoutingModule } from './prorrateo-goods-surveillance-routing.module';
import { GoodsRequestModalComponent } from './prorrateo-goods-surveillance/goods-request-modal/goods-request-modal.component';
import { ProrrateoGoodSurveillanceModalComponent } from './prorrateo-goods-surveillance/prorrateo-good-surveillance-modal/prorrateo-good-surveillance-modal.component';
import { ProrrateoGoodSurveillancePolicyModalComponent } from './prorrateo-goods-surveillance/prorrateo-good-surveillance-policy-modal/policy-modal.component';
import { ProrrateoGoodsSurveillanceComponent } from './prorrateo-goods-surveillance/prorrateo-goods-surveillance.component';
import { ProrrateoGoodsComponent } from './prorrateo-goods/prorrateo-goods.component';

@NgModule({
  declarations: [
    ProrrateoGoodsSurveillanceComponent,
    ProrrateoConceptsComponent,
    ProrrateoGoodsComponent,
    GoodsRequestModalComponent,
    ProrrateoGoodSurveillanceModalComponent,
    ProrrateoGoodSurveillancePolicyModalComponent,
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
