import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { CRaeCDisposalRecordReportComponent } from './c-rae-c-disposal-record-report/c-rae-c-disposal-record-report.component';
import { CRaeMDisposalRecordReportRoutingModule } from './c-rae-m-disposal-record-report-routing.module';

@NgModule({
  declarations: [CRaeCDisposalRecordReportComponent],
  imports: [
    CommonModule,
    CRaeMDisposalRecordReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CRaeMDisposalRecordReportModule {}
