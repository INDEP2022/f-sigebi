import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoliciesReportRoutingModule } from './policies-report-routing.module';
import { PoliciesReportComponent } from './policies-report/policies-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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
