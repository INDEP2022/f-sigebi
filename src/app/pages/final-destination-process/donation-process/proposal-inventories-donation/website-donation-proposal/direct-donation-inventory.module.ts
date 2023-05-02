import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProposalInventoriesDonationModule } from '../proposal-inventories-donation/proposal-inventories-donation.module';
import { DirectDonationInventoryRoutingModule } from './direct-donation-inventory-routing.module';
import { DirectDonationInventoryComponent } from './website-donation-proposal/direct-donation-inventory.component';

@NgModule({
  declarations: [DirectDonationInventoryComponent],
  imports: [
    CommonModule,
    DirectDonationInventoryRoutingModule,
    ProposalInventoriesDonationModule,
  ],
})
export class DirectDonationInventoryModule {}
