import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { LossOfGoodsPolicyRoutingModule } from './loss-of-goods-policy-routing.module';
import { LossOfGoodsPolicyComponent } from './loss-of-goods-policy/loss-of-goods-policy.component';

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
