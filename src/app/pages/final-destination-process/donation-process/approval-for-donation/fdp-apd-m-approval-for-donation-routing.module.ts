import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpApdCApprovalForDonationComponent } from './approval-for-donation/fdp-apd-c-approval-for-donation.component';

const routes: Routes = [
  {
    path: '',
    component: FdpApdCApprovalForDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpApdMApprovalForDonationRoutingModule {}
