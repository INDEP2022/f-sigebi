import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { PeAdMApprovalAssetsDestinationRoutingModule } from './pe-ad-m-approval-assets-destination-routing.module';
import { PeAdCApprovalAssetsDestinationComponent } from './pe-ad-c-approval-assets-destination/pe-ad-c-approval-assets-destination.component';

@NgModule({
  declarations: [PeAdCApprovalAssetsDestinationComponent],
  imports: [
    CommonModule,
    PeAdMApprovalAssetsDestinationRoutingModule,
    SharedModule,
  ],
})
export class PeAdMApprovalAssetsDestinationModule {}
