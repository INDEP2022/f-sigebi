import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { proofDeliveryRoutingModule } from './proof-delivery-routing.module';
import { proofDeliveryComponent } from './proof-delivery/proof-delivery.component';

@NgModule({
  declarations: [proofDeliveryComponent],
  imports: [CommonModule, proofDeliveryRoutingModule, SharedModule],
})
export class proofDeliveryModule {}
