import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RealEstateAnalyticalReportRoutingModule } from './real-estate-analytical-report-routing.module';
import { RealEstateAnalyticalReportComponent } from './real-estate-analytical-report/real-estate-analytical-report.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RealEstateAnalyticalReportComponent
  ],
  imports: [
    CommonModule,
    RealEstateAnalyticalReportRoutingModule,
    SharedModule
  ]
})
export class RealEstateAnalyticalReportModule { }
