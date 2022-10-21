import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AppraisalGoodsRoutingModule } from './appraisal-goods-routing.module';
import { AppraisalGoodsComponent } from './appraisal-goods/appraisal-goods.component';

@NgModule({
  declarations: [AppraisalGoodsComponent],
  imports: [
    CommonModule,
    AppraisalGoodsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class AppraisalGoodsModule {}
