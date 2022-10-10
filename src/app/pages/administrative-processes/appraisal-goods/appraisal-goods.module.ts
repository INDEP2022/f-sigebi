import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppraisalGoodsRoutingModule } from './appraisal-goods-routing.module';
import { AppraisalGoodsComponent } from './appraisal-goods/appraisal-goods.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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
