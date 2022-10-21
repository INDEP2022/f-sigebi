import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { JprRecordsReportRoutingModule } from './jpr-records-report-routing.module';
import { JprRecordsReportComponent } from './jpr-records-report.component';

@NgModule({
  declarations: [JprRecordsReportComponent],
  imports: [
    CommonModule,
    JprRecordsReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class JprRecordsReportModule {}
