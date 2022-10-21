import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpPidMProposalInventoriesDonationRoutingModule } from './fdp-pid-m-proposal-inventories-donation-routing.module';
import { FdpPidCProposalInventoriesDonationComponent } from './proposal-inventories-donation/fdp-pid-c-proposal-inventories-donation.component';

@NgModule({
  declarations: [FdpPidCProposalInventoriesDonationComponent],
  imports: [
    CommonModule,
    FdpPidMProposalInventoriesDonationRoutingModule,
    SharedModule,
  ],
  exports: [FdpPidCProposalInventoriesDonationComponent],
})
export class FdpPidMProposalInventoriesDonationModule {}
