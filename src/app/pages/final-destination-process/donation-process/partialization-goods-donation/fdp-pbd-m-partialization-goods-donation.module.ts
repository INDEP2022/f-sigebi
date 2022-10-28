import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpPbdMPartializationGoodsDonationRoutingModule } from './fdp-pbd-m-partialization-goods-donation-routing.module';
import { FdpPbdCPartializationGoodsDonationComponent } from './partialization-goods-donation/fdp-pbd-c-partialization-goods-donation.component';

@NgModule({
  declarations: [FdpPbdCPartializationGoodsDonationComponent],
  imports: [
    CommonModule,
    FdpPbdMPartializationGoodsDonationRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class FdpPbdMPartializationGoodsDonationModule {}
