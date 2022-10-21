import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpApdCApprovalForDonationComponent } from './approval-for-donation/fdp-apd-c-approval-for-donation.component';
import { FdpCadCCaptureApprovalDonationComponent } from './capture-approval-donation/fdp-cad-c-capture-approval-donation.component';

const routes: Routes = [
  {
    path: '',
    component: FdpApdCApprovalForDonationComponent,
  },
  {
    path: 'capture-approval-donation',
    component: FdpCadCCaptureApprovalDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpApdMApprovalForDonationRoutingModule {}
