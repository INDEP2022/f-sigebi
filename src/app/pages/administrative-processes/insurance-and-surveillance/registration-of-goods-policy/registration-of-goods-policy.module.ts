import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationOfGoodsPolicyRoutingModule } from './registration-of-goods-policy-routing.module';
import { RegistrationOfGoodsPolicyComponent } from './registration-of-goods-policy/registration-of-goods-policy.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RegistrationOfGoodsPolicyComponent],
  imports: [
    CommonModule,
    RegistrationOfGoodsPolicyRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class RegistrationOfGoodsPolicyModule {}
