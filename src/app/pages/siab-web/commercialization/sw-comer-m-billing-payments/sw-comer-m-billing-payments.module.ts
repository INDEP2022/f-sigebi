import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SwComerCBillingPaymentsComponent } from './sw-comer-c-billing-payments/sw-comer-c-billing-payments.component';
import { SwComerMBillingPaymentsRoutingModule } from './sw-comer-m-billing-payments-routing.module';

@NgModule({
  declarations: [SwComerCBillingPaymentsComponent],
  imports: [CommonModule, SwComerMBillingPaymentsRoutingModule],
})
export class SwComerMBillingPaymentsModule {}
