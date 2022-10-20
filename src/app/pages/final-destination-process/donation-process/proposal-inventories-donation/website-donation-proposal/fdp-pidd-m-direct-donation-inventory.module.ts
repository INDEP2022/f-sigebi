import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpPiddMDirectDonationInventoryRoutingModule } from './fdp-pidd-m-direct-donation-inventory-routing.module';
import { FdpPiddCDirectDonationInventoryComponent } from './website-donation-proposal/fdp-pidd-c-direct-donation-inventory.component';
import { FdpPidMProposalInventoriesDonationModule } from '../proposal-inventories-donation/fdp-pid-m-proposal-inventories-donation.module';

@NgModule({
  declarations: [FdpPiddCDirectDonationInventoryComponent],
  imports: [
    CommonModule,
    FdpPiddMDirectDonationInventoryRoutingModule,
    FdpPidMProposalInventoriesDonationModule,
  ],
})
export class FdpPiddMDirectDonationInventoryModule {}
