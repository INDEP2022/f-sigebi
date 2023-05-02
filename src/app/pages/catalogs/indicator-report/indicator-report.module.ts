import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { IndicatorReportFormComponent } from './indicator-report-form/indicator-report-form.component';
import { IndicatorReportListComponent } from './indicator-report-list/indicator-report-list.component';
import { IndicatorReportRoutingModule } from './indicator-report-routing.module';

@NgModule({
  declarations: [IndicatorReportFormComponent, IndicatorReportListComponent],
  imports: [
    CommonModule,
    IndicatorReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class IndicatorReportModule {}
