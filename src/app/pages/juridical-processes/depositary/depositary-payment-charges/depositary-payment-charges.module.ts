import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { DepositaryPaymentChargesRoutingModule } from './depositary-payment-charges-routing.module';
import { DepositaryPaymentChargesComponent } from './depositary-payment-charges/depositary-payment-charges.component';

@NgModule({
  declarations: [DepositaryPaymentChargesComponent],
  imports: [CommonModule, DepositaryPaymentChargesRoutingModule, SharedModule],
})
export class DepositaryPaymentChargesModule {}
