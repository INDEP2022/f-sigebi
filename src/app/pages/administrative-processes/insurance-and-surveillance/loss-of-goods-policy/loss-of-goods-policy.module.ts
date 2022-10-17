import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LossOfGoodsPolicyRoutingModule } from './loss-of-goods-policy-routing.module';
import { LossOfGoodsPolicyComponent } from './loss-of-goods-policy/loss-of-goods-policy.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LossOfGoodsPolicyComponent],
  imports: [
    CommonModule,
    LossOfGoodsPolicyRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class LossOfGoodsPolicyModule {}
