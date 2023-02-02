import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary/summary.component';

@NgModule({
  declarations: [SummaryComponent],
  imports: [
    CommonModule,
    SummaryRoutingModule,
    SharedModule,
    DelegationSharedComponent,
  ],
})
export class SummaryModule {}
