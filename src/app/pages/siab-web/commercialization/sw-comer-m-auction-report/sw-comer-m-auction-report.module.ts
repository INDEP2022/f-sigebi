import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { SwComerCAuctionReportComponent } from './sw-comer-c-auction-report/sw-comer-c-auction-report.component';
import { SwComerMAuctionReportRoutingModule } from './sw-comer-m-auction-report-routing.module';

@NgModule({
  declarations: [SwComerCAuctionReportComponent],
  imports: [
    CommonModule,
    SwComerMAuctionReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class SwComerMAuctionReportModule {}
