import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecordsReportRoutingModule } from './records-report-routing.module';
import { RecordsReportComponent } from './records-report.component';

@NgModule({
  declarations: [RecordsReportComponent],
  imports: [
    CommonModule,
    RecordsReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class RecordsReportModule {}
