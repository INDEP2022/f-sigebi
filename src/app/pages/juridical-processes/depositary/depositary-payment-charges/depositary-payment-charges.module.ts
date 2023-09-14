import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DepositaryPaymentChargesRoutingModule } from './depositary-payment-charges-routing.module';
import { DepositaryPaymentChargesComponent } from './depositary-payment-charges/depositary-payment-charges.component';

@NgModule({
  declarations: [DepositaryPaymentChargesComponent],
  imports: [
    CommonModule,
    DepositaryPaymentChargesRoutingModule,
    SharedModule,
    BanksSharedComponent,
  ],
})
export class DepositaryPaymentChargesModule {}
