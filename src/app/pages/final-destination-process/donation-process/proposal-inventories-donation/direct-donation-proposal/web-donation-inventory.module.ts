import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProposalInventoriesDonationModule } from '../proposal-inventories-donation/proposal-inventories-donation.module';
import { WebDonationInventoryComponent } from './direct-donation-proposal/web-donation-inventory.component';
import { WebDonationInventoryRoutingModule } from './web-donation-inventory-routing.module';

@NgModule({
  declarations: [WebDonationInventoryComponent],
  imports: [
    CommonModule,
    WebDonationInventoryRoutingModule,
    ProposalInventoriesDonationModule,
  ],
})
export class WebDonationInventoryModule {}
