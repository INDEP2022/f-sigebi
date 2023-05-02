import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProposalInventoriesDonationRoutingModule } from './proposal-inventories-donation-routing.module';
import { ProposalInventoriesDonationComponent } from './proposal-inventories-donation/proposal-inventories-donation.component';

@NgModule({
  declarations: [ProposalInventoriesDonationComponent],
  imports: [
    CommonModule,
    ProposalInventoriesDonationRoutingModule,
    SharedModule,
  ],
  exports: [ProposalInventoriesDonationComponent],
})
export class ProposalInventoriesDonationModule {}
