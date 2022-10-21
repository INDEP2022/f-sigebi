import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { PeAdCDonationApprovalComponent } from './pe-ad-c-donation-approval/pe-ad-c-donation-approval.component';
import { PeAdMDonationApprovalRoutingModule } from './pe-ad-m-donation-approval-routing.module';

@NgModule({
  declarations: [PeAdCDonationApprovalComponent],
  imports: [CommonModule, PeAdMDonationApprovalRoutingModule, SharedModule],
})
export class PeAdMDonationApprovalModule {}
