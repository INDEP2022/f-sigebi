import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { RegistrationOfGoodsPolicyRoutingModule } from './registration-of-goods-policy-routing.module';
import { RegistrationOfGoodsPolicyComponent } from './registration-of-goods-policy/registration-of-goods-policy.component';

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
