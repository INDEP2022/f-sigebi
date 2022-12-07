import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonationApprovalComponent } from './donation-approval/donation-approval.component';

const routes: Routes = [
  {
    path: '',
    component: DonationApprovalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationApprovalRoutingModule {}
