import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
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
    DelegationSharedComponent,
  ],
})
export class RecordsReportModule {}
