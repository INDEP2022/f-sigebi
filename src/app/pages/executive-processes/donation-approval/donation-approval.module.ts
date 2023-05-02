import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { DonationApprovalRoutingModule } from './donation-approval-routing.module';
import { DonationApprovalComponent } from './donation-approval/donation-approval.component';

@NgModule({
  declarations: [DonationApprovalComponent],
  imports: [CommonModule, DonationApprovalRoutingModule, SharedModule],
})
export class DonationApprovalModule {}
