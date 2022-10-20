import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaMPaymentClaimProcessRoutingModule } from './pa-m-payment-claim-process-routing.module';
import { PaPcpCPaymentClaimProcessComponent } from './pa-pcp-c-payment-claim-process/pa-pcp-c-payment-claim-process.component';


@NgModule({
  declarations: [
    PaPcpCPaymentClaimProcessComponent
  ],
  imports: [
    CommonModule,
    PaMPaymentClaimProcessRoutingModule
  ]
})
export class PaMPaymentClaimProcessModule { }
