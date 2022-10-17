import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { PeAdMDonationApprovalRoutingModule } from './pe-ad-m-donation-approval-routing.module';
import { PeAdCDonationApprovalComponent } from './pe-ad-c-donation-approval/pe-ad-c-donation-approval.component';

@NgModule({
  declarations: [PeAdCDonationApprovalComponent],
  imports: [CommonModule, PeAdMDonationApprovalRoutingModule, SharedModule],
})
export class PeAdMDonationApprovalModule {}
