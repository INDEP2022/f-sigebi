import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpPidCProposalInventoriesDonationComponent } from './proposal-inventories-donation/fdp-pid-c-proposal-inventories-donation.component';
import { FdpPidMProposalInventoriesDonationRoutingModule } from './fdp-pid-m-proposal-inventories-donation-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

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
