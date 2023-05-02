import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { billingPaymentsModalComponent } from './billing-payments-modal/billing-payments-modal.component';
import { billingPaymentsRoutingModule } from './billing-payments-routing.module';
import { billingPaymentsComponent } from './billing-payments/billing-payments.component';

@NgModule({
  declarations: [billingPaymentsComponent, billingPaymentsModalComponent],
  imports: [
    CommonModule,
    billingPaymentsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class billingPaymentsModule {}
