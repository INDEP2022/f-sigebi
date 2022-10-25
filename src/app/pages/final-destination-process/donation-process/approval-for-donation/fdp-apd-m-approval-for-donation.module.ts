import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpApdCApprovalForDonationComponent } from './approval-for-donation/fdp-apd-c-approval-for-donation.component';
import { FdpCadCCaptureApprovalDonationComponent } from './capture-approval-donation/fdp-cad-c-capture-approval-donation.component';
import { FdpMadCModalApprovalDonationComponent } from './modal-approval-donation/fdp-mad-c-modal-approval-donation.component';
import { FdpApdMApprovalForDonationRoutingModule } from './fdp-apd-m-approval-for-donation-routing.module';

@NgModule({
  declarations: [
    FdpApdCApprovalForDonationComponent,
    FdpCadCCaptureApprovalDonationComponent,
    FdpMadCModalApprovalDonationComponent,
  ],
  imports: [
    CommonModule,
    FdpApdMApprovalForDonationRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class FdpApdMApprovalForDonationModule {}
