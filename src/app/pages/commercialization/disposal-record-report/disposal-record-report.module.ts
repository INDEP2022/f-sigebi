import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { DisposalRecordReportRoutingModule } from './disposal-record-report-routing.module';
import { DisposalRecordReportComponent } from './disposal-record-report/disposal-record-report.component';

@NgModule({
  declarations: [DisposalRecordReportComponent],
  imports: [
    CommonModule,
    DisposalRecordReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class DisposalRecordReportModule {}
