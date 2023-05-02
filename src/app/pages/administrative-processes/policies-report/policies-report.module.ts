import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PoliciesReportRoutingModule } from './policies-report-routing.module';
import { PoliciesReportComponent } from './policies-report/policies-report.component';

@NgModule({
  declarations: [PoliciesReportComponent],
  imports: [
    CommonModule,
    PoliciesReportRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class PoliciesReportModule {}
