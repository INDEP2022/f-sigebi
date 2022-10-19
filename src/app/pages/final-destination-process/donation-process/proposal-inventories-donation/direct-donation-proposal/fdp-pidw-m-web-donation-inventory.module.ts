import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpPidwMWebDonationInventoryRoutingModule } from './fdp-pidw-m-web-donation-inventory-routing.module';
import { FdpPidwCWebDonationInventoryComponent } from './direct-donation-proposal/fdp-pidw-c-web-donation-inventory.component';
import { FdpPidMProposalInventoriesDonationModule } from '../proposal-inventories-donation/fdp-pid-m-proposal-inventories-donation.module';

@NgModule({
  declarations: [FdpPidwCWebDonationInventoryComponent],
  imports: [
    CommonModule,
    FdpPidwMWebDonationInventoryRoutingModule,
    FdpPidMProposalInventoriesDonationModule,
  ],
})
export class FdpPidwMWebDonationInventoryModule {}
