import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicCompensationModule } from '../economic-compensation.module';
import { GreCPaymentOrderMainComponent } from './gre-c-payment-order-main/gre-c-payment-order-main.component';
import { GreMPaymentOrderRoutingModule } from './gre-m-payment-order-routing.module';

@NgModule({
  declarations: [GreCPaymentOrderMainComponent],
  imports: [
    CommonModule,
    GreMPaymentOrderRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
  ],
})
export class GreMPaymentOrderModule {}
