import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpApdCApprovalForDonationComponent } from './approval-for-donation/fdp-apd-c-approval-for-donation.component';
import { FdpApdMApprovalForDonationRoutingModule } from './fdp-apd-m-approval-for-donation-routing.module';

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
