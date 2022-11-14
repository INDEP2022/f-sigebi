import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPCCatDepositoryPaymentModalComponent } from './c-p-c-cat-depository-payment-modal/c-p-c-cat-depository-payment-modal.component';
import { CPCCatDepositoryPaymentComponent } from './c-p-c-cat-depository-payment/c-p-c-cat-depository-payment.component';
import { CPMCatDepositoryPaymentRoutingModule } from './c-p-m-cat-depository-payment-routing.module';

@NgModule({
  declarations: [
    CPCCatDepositoryPaymentComponent,
    CPCCatDepositoryPaymentModalComponent,
  ],
  imports: [
    CommonModule,
    CPMCatDepositoryPaymentRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMCatDepositoryPaymentModule {}
