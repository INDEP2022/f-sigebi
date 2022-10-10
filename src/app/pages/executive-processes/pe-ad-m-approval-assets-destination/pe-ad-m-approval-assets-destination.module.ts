import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { PeAdMApprovalAssetsDestinationRoutingModule } from './pe-ad-m-approval-assets-destination-routing.module';
import { PeAdCApprovalAssetsDestinationComponent } from './pe-ad-c-approval-assets-destination/pe-ad-c-approval-assets-destination.component';


@NgModule({
  declarations: [
    PeAdCApprovalAssetsDestinationComponent
  ],
  imports: [
    CommonModule,
    PeAdMApprovalAssetsDestinationRoutingModule,
    SharedModule,
    Ng2SmartTableModule
  ]
})
export class PeAdMApprovalAssetsDestinationModule { }
