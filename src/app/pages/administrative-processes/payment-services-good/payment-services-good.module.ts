import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentGlobComponent } from './payment-glob/payment-glob.component';
import { PaymentServicesGoodComponent } from './payment-services-good.component';
import { PaymentServicesGoodRoutingModule } from './payment-services-good.routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, PaymentServicesGoodRoutingModule],
  declarations: [PaymentServicesGoodComponent, PaymentGlobComponent],
})
export class PaymentServicesGoodModule {}
