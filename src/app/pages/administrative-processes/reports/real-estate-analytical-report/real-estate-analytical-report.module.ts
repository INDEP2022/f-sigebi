import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { RealEstateAnalyticalReportRoutingModule } from './real-estate-analytical-report-routing.module';
import { RealEstateAnalyticalReportComponent } from './real-estate-analytical-report/real-estate-analytical-report.component';

@NgModule({
  declarations: [RealEstateAnalyticalReportComponent],
  imports: [
    CommonModule,
    RealEstateAnalyticalReportRoutingModule,
    SharedModule,
  ],
})
export class RealEstateAnalyticalReportModule {}
