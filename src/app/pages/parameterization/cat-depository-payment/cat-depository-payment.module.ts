import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CatDepositoryPaymentModalComponent } from './cat-depository-payment-modal/cat-depository-payment-modal.component';
import { CatDepositoryPaymentRoutingModule } from './cat-depository-payment-routing.module';
import { CatDepositoryPaymentComponent } from './cat-depository-payment/cat-depository-payment.component';

@NgModule({
  declarations: [
    CatDepositoryPaymentComponent,
    CatDepositoryPaymentModalComponent,
  ],
  imports: [
    CommonModule,
    CatDepositoryPaymentRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CatDepositoryPaymentModule {}
