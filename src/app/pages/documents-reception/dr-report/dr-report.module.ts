import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrReportRoutingModule } from './dr-report-routing.module';
import { DrReportComponent } from './dr-report/dr-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

@NgModule({
  declarations: [DrReportComponent],
  imports: [
    CommonModule,
    DrReportRoutingModule,
    SharedModule,
    DelegationSharedComponent,
  ],
})
export class DrReportModule {}
