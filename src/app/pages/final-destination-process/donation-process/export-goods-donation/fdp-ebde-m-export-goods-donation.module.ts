import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpEbdeMExportGoodsDonationRoutingModule } from './fdp-ebde-m-export-goods-donation-routing.module';
import { FdpEbdeCExportGoodsDonationComponent } from './export-goods-donation/fdp-ebde-c-export-goods-donation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FdpEbdeCExportGoodsDonationComponent],
  imports: [
    CommonModule,
    FdpEbdeMExportGoodsDonationRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class FdpEbdeMExportGoodsDonationModule {}
