import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalForDonationComponent } from './approval-for-donation/approval-for-donation.component';
import { CaptureApprovalDonationComponent } from './capture-approval-donation/capture-approval-donation.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalForDonationComponent,
  },
  {
    path: 'capture-approval-donation',
    component: CaptureApprovalDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalForDonationRoutingModule {}
