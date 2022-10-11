import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrSummaryRoutingModule } from './dr-summary-routing.module';
import { DrSummaryComponent } from './dr-summary/dr-summary.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

@NgModule({
  declarations: [DrSummaryComponent],
  imports: [
    CommonModule,
    DrSummaryRoutingModule,
    SharedModule,
    DelegationSharedComponent,
  ],
})
export class DrSummaryModule {}
