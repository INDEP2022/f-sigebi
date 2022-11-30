import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { SwComerCBillingPaymentsModalComponent } from './sw-comer-c-billing-payments-modal/sw-comer-c-billing-payments-modal.component';
import { SwComerCBillingPaymentsComponent } from './sw-comer-c-billing-payments/sw-comer-c-billing-payments.component';
import { SwComerMBillingPaymentsRoutingModule } from './sw-comer-m-billing-payments-routing.module';

@NgModule({
  declarations: [
    SwComerCBillingPaymentsComponent,
    SwComerCBillingPaymentsModalComponent,
  ],
  imports: [
    CommonModule,
    SwComerMBillingPaymentsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class SwComerMBillingPaymentsModule {}
