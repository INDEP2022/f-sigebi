import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReportExposureForSaleModalComponent } from './report-exposure-for-sale-modal/report-exposure-for-sale-modal.component';
import { ReportExposureForSaleRoutingModule } from './report-exposure-for-sale-routing.module';
import { ReportExposureForSaleComponent } from './report-exposure-for-sale/report-exposure-for-sale.component';

@NgModule({
  declarations: [
    ReportExposureForSaleComponent,
    ReportExposureForSaleModalComponent,
  ],
  imports: [CommonModule, ReportExposureForSaleRoutingModule, SharedModule],
})
export class ReportExposureForSaleModule {}
