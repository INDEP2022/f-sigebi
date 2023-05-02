import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PartializationGoodsDonationRoutingModule } from './partialization-goods-donation-routing.module';
import { PartializationGoodsDonationComponent } from './partialization-goods-donation/partialization-goods-donation.component';

@NgModule({
  declarations: [PartializationGoodsDonationComponent],
  imports: [
    CommonModule,
    PartializationGoodsDonationRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class PartializationGoodsDonationModule {}
