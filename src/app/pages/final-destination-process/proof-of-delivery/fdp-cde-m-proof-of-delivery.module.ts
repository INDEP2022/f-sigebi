import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpCdeMProofOfDeliveryRoutingModule } from './fdp-cde-m-proof-of-delivery-routing.module';
import { FdpCdeCProofOfDeliveryComponent } from './proof of delivery/fdp-cde-c-proof-of-delivery.component';

@NgModule({
  declarations: [FdpCdeCProofOfDeliveryComponent],
  imports: [
    CommonModule,
    FdpCdeMProofOfDeliveryRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class FdpCdeMProofOfDeliveryModule {}
