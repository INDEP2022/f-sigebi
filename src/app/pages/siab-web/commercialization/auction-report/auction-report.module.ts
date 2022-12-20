import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { auctionReportRoutingModule } from './auction-report-routing.module';
import { auctionReportComponent } from './auction-report/auction-report.component';

@NgModule({
  declarations: [auctionReportComponent],
  imports: [
    CommonModule,
    auctionReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class auctionReportModule {}
