import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { DepartmentsSharedComponent } from 'src/app/@standalone/shared-forms/departments-shared/departments-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SummaryDestinationRoutingModule } from './summary-destination-routing.module';
import { SummaryDestinationComponent } from './summary-destination/summary-destination.component';

@NgModule({
  declarations: [SummaryDestinationComponent],
  imports: [
    CommonModule,
    SummaryDestinationRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    DepartmentsSharedComponent,
  ],
})
export class SummaryDestinationModule {}
