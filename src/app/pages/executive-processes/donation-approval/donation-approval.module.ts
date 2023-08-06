import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';
import { DonationApprovalRoutingModule } from './donation-approval-routing.module';
import { DonationApprovalComponent } from './donation-approval/donation-approval.component';
import { UpdateModalComponent } from './update-modal/update-modal.component';

@NgModule({
  declarations: [DonationApprovalComponent, UpdateModalComponent],
  imports: [
    CommonModule,
    DonationApprovalRoutingModule,
    SharedModule,
    GoodsStatusSharedComponent,
  ],
})
export class DonationApprovalModule {}
