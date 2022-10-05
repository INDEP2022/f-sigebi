import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeAdCDonationApprovalComponent } from './pe-ad-c-donation-approval/pe-ad-c-donation-approval.component';

const routes: Routes = [
  {
    path: '',
    component: PeAdCDonationApprovalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeAdMDonationApprovalRoutingModule { }
