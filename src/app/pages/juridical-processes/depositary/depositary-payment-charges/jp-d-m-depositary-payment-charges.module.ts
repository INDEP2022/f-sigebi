import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { JpDDpcCDepositaryPaymentChargesComponent } from './jp-d-dpc-c-depositary-payment-charges/jp-d-dpc-c-depositary-payment-charges.component';
import { JpDMDepositaryPaymentChargesRoutingModule } from './jp-d-m-depositary-payment-charges-routing.module';

@NgModule({
  declarations: [JpDDpcCDepositaryPaymentChargesComponent],
  imports: [
    CommonModule,
    JpDMDepositaryPaymentChargesRoutingModule,
    SharedModule,
  ],
})
export class JpDMDepositaryPaymentChargesModule {}
