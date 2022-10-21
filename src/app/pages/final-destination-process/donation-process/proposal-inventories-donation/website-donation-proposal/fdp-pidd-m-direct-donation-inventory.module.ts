import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FdpPidMProposalInventoriesDonationModule } from '../proposal-inventories-donation/fdp-pid-m-proposal-inventories-donation.module';
import { FdpPiddMDirectDonationInventoryRoutingModule } from './fdp-pidd-m-direct-donation-inventory-routing.module';
import { FdpPiddCDirectDonationInventoryComponent } from './website-donation-proposal/fdp-pidd-c-direct-donation-inventory.component';

@NgModule({
  declarations: [FdpPiddCDirectDonationInventoryComponent],
  imports: [
    CommonModule,
    FdpPiddMDirectDonationInventoryRoutingModule,
    FdpPidMProposalInventoriesDonationModule,
  ],
})
export class FdpPiddMDirectDonationInventoryModule {}
