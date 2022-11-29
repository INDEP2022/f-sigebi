import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SwComerCProofDeliveryComponent } from './sw-comer-c-proof-delivery/sw-comer-c-proof-delivery.component';
import { SwComerMProofDeliveryRoutingModule } from './sw-comer-m-proof-delivery-routing.module';

@NgModule({
  declarations: [SwComerCProofDeliveryComponent],
  imports: [CommonModule, SwComerMProofDeliveryRoutingModule],
})
export class SwComerMProofDeliveryModule {}
