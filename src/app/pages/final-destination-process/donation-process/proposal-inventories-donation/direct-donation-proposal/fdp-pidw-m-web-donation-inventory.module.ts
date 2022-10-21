import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FdpPidMProposalInventoriesDonationModule } from '../proposal-inventories-donation/fdp-pid-m-proposal-inventories-donation.module';
import { FdpPidwCWebDonationInventoryComponent } from './direct-donation-proposal/fdp-pidw-c-web-donation-inventory.component';
import { FdpPidwMWebDonationInventoryRoutingModule } from './fdp-pidw-m-web-donation-inventory-routing.module';

@NgModule({
  declarations: [FdpPidwCWebDonationInventoryComponent],
  imports: [
    CommonModule,
    FdpPidwMWebDonationInventoryRoutingModule,
    FdpPidMProposalInventoriesDonationModule,
  ],
})
export class FdpPidwMWebDonationInventoryModule {}
