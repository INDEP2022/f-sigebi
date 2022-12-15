import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicCompensationModule } from '../economic-compensation.module';
import { PaymentOrderMainComponent } from './payment-order-main/payment-order-main.component';
import { PaymentOrderRoutingModule } from './payment-order-routing.module';

@NgModule({
  declarations: [PaymentOrderMainComponent],
  imports: [
    CommonModule,
    PaymentOrderRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
  ],
})
export class PaymentOrderModule {}
