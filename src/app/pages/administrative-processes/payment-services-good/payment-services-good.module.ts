import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaymentServicesGoodComponent } from './payment-services-good.component';
import { PaymentServicesGoodRoutingModule } from './payment-services-good.routing.module';

@NgModule({
  imports: [CommonModule, PaymentServicesGoodRoutingModule],
  declarations: [PaymentServicesGoodComponent],
})
export class PaymentServicesGoodModule {}
