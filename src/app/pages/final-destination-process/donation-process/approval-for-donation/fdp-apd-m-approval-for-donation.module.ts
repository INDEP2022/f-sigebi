import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpApdMApprovalForDonationRoutingModule } from './fdp-apd-m-approval-for-donation-routing.module';
import { FdpApdCApprovalForDonationComponent } from './approval-for-donation/fdp-apd-c-approval-for-donation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FdpApdCApprovalForDonationComponent],
  imports: [
    CommonModule,
    FdpApdMApprovalForDonationRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class FdpApdMApprovalForDonationModule {}
