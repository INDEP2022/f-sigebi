import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeAdCApprovalAssetsDestinationComponent } from './pe-ad-c-approval-assets-destination/pe-ad-c-approval-assets-destination.component';

const routes: Routes = [
  {
    path:'',
    component: PeAdCApprovalAssetsDestinationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeAdMApprovalAssetsDestinationRoutingModule { }
