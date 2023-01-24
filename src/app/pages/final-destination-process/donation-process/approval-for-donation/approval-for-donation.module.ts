import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApprovalForDonationRoutingModule } from './approval-for-donation-routing.module';
import { ApprovalForDonationComponent } from './approval-for-donation/approval-for-donation.component';
import { CaptureApprovalDonationComponent } from './capture-approval-donation/capture-approval-donation.component';
import { ModalApprovalDonationComponent } from './modal-approval-donation/modal-approval-donation.component';

@NgModule({
  declarations: [
    ApprovalForDonationComponent,
    CaptureApprovalDonationComponent,
    ModalApprovalDonationComponent,
  ],
  imports: [
    CommonModule,
    ApprovalForDonationRoutingModule,
    SharedModule,
    FormsModule,
  ],
  exports: [ModalApprovalDonationComponent],
})
export class ApprovalForDonationModule {}
