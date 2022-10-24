import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpEbdeCExportGoodsDonationComponent } from './export-goods-donation/fdp-ebde-c-export-goods-donation.component';
import { FdpEbdeMExportGoodsDonationRoutingModule } from './fdp-ebde-m-export-goods-donation-routing.module';

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
