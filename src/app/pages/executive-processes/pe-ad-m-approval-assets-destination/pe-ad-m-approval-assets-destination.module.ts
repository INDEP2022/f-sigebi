import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeAdMApprovalAssetsDestinationRoutingModule } from './pe-ad-m-approval-assets-destination-routing.module';
import { PeAdCApprovalAssetsDestinationComponent } from './pe-ad-c-approval-assets-destination/pe-ad-c-approval-assets-destination.component';


@NgModule({
  declarations: [
    PeAdCApprovalAssetsDestinationComponent
  ],
  imports: [
    CommonModule,
    PeAdMApprovalAssetsDestinationRoutingModule
  ]
})
export class PeAdMApprovalAssetsDestinationModule { }
