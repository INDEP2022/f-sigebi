import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { SwComerCWinnersReportComponent } from './sw-comer-c-winners-report/sw-comer-c-winners-report.component';
import { SwComerMWinnersReportRoutingModule } from './sw-comer-m-winners-report-routing.module';

@NgModule({
  declarations: [SwComerCWinnersReportComponent],
  imports: [
    CommonModule,
    SwComerMWinnersReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class SwComerMWinnersReportModule {}
