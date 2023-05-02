import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { DisposalRecordReportRoutingModule } from './disposal-record-report-routing.module';
import { DisposalRecordReportComponent } from './disposal-record-report/disposal-record-report.component';

@NgModule({
  declarations: [DisposalRecordReportComponent],
  imports: [
    CommonModule,
    DisposalRecordReportRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    ModalModule.forChild(),
  ],
})
export class DisposalRecordReportModule {}
