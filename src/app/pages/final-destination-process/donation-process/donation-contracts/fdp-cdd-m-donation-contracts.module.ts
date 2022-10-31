import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedFinalDestinationModule } from '../../shared-final-destination/shared-final-destination.module';
import { FdpCddCDonationContractsComponent } from './donation-contracts/fdp-cdd-c-donation-contracts.component';
import { FdpCddMDonationContractsRoutingModule } from './fdp-cdd-m-donation-contracts-routing.module';

@NgModule({
  declarations: [FdpCddCDonationContractsComponent],
  imports: [
    CommonModule,
    FdpCddMDonationContractsRoutingModule,
    SharedModule,
    NgScrollbarModule,
    SharedFinalDestinationModule,
  ],
})
export class FdpCddMDonationContractsModule {}
