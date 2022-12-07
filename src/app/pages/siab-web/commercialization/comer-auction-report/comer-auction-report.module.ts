import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { ComerAuctionReportFormComponent } from './comer-auction-report-form/comer-auction-report-form.component';
import { ComerAuctionReportRoutingModule } from './comer-auction-report-routing.module';

@NgModule({
  declarations: [ComerAuctionReportFormComponent],
  imports: [
    CommonModule,
    ComerAuctionReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ComerAuctionReportModule {}
