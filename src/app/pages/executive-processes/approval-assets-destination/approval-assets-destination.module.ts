import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { ApprovalAssetsDestinationRoutingModule } from './approval-assets-destination-routing.module';
import { ApprovalAssetsDestinationComponent } from './approval-assets-destination/approval-assets-destination.component';

@NgModule({
  declarations: [ApprovalAssetsDestinationComponent],
  imports: [CommonModule, ApprovalAssetsDestinationRoutingModule, SharedModule],
})
export class ApprovalAssetsDestinationModule {}
