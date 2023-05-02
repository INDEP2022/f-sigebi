import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { FinancialInformationReportRoutingModule } from './financial-information-report-routing.module';
import { FinancialInformationReportComponent } from './financial-information-report/financial-information-report.component';

@NgModule({
  declarations: [FinancialInformationReportComponent],
  imports: [
    CommonModule,
    FinancialInformationReportRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class FinancialInformationReportModule {}
